import { expect, test, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const shotDir = join(process.cwd(), "e2e", "screenshots");

const PAGES = ["/", "/services", "/pricing", "/about", "/faq", "/contact", "/login", "/signup", "/book"] as const;

const WIDTHS = [320, 360, 375, 390, 430, 600, 768, 820, 900, 1024, 1100, 1280, 1366, 1440, 1600, 1920, 2560] as const;

const ZOOM_EQUIVALENT: { label: string; width: number; height: number }[] = [
  { label: "80%", width: 1800, height: 1125 },
  { label: "100%", width: 1440, height: 900 },
  { label: "125%", width: 1152, height: 720 },
  { label: "150%", width: 960, height: 600 },
  { label: "200%", width: 720, height: 450 },
  { label: "400%", width: 360, height: 225 },
];

async function ready(page: Page, path = "/") {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(path);
  await page.locator("html[data-hydrated='true']").waitFor({ state: "attached" });
  return errors;
}

async function pageOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

function heightFor(width: number) {
  if (width <= 430) return 844;
  if (width <= 900) return 1024;
  if (width <= 1440) return 900;
  return 1080;
}

test.describe("responsive layout", () => {
  test("all pages reflow without page-wide overflow across viewport widths", async ({ page }) => {
    test.setTimeout(180_000);
    const failures: string[] = [];
    for (const path of PAGES) {
      await ready(page, path);
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: heightFor(width) });
        const overflow = await pageOverflow(page);
        if (overflow > 1) failures.push(`${path} @ ${width}px overflow ${overflow}`);
      }
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });

  test("layout updates while resizing without a reload", async ({ page }) => {
    const errors = await ready(page, "/");
    await expect(page.getByRole("heading", { name: /fresh clothes/i })).toBeVisible();

    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Services", exact: true })).toBeVisible();

    await page.setViewportSize({ width: 820, height: 1180 });
    await expect(page.locator('header button[aria-controls="mobile-menu"]')).toBeVisible();
    await expect(page.locator("#services")).toBeVisible();

    await page.setViewportSize({ width: 360, height: 800 });
    await expect(page.locator('header button[aria-controls="mobile-menu"]')).toBeVisible();
    await page.locator('header button[aria-controls="mobile-menu"]').click();
    await expect(page.locator("#mobile-menu").getByRole("link", { name: "Pricing" })).toBeVisible();
    await page.getByRole("button", { name: /close menu/i }).click();

    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "FAQ", exact: true })).toBeVisible();
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByRole("contentinfo")).toBeVisible();
    expect(errors, errors.join("\n")).toEqual([]);
  });

  test("journey stays usable after resize and orientation change", async ({ page }) => {
    const errors = await ready(page, "/");
    await page.locator("#journey").scrollIntoViewIfNeeded();
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator("#journey")).toBeVisible();
    await page.setViewportSize({ width: 844, height: 390 });
    await expect(page.locator("#journey")).toBeVisible();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.evaluate(() => {
      const el = document.querySelector("#journey");
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + (el as HTMLElement).offsetHeight * 0.4);
    });
    await expect(page.locator("#journey")).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByRole("contentinfo")).toBeVisible();
    expect(errors, errors.join("\n")).toEqual([]);
  });

  test("auth dialog stays in viewport at a narrow width", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 700 });
    await ready(page, "/");
    await page.locator("section").first().getByRole("button", { name: /book a pickup/i }).click();
    const dialog = page.getByRole("heading", { name: /login required/i });
    await expect(dialog).toBeVisible();
    const box = await page.getByRole("dialog").boundingBox();
    expect(box).toBeTruthy();
    expect(box!.x).toBeGreaterThanOrEqual(-1);
    expect(box!.x + box!.width).toBeLessThanOrEqual(361);
    expect(box!.y).toBeGreaterThanOrEqual(-1);
    expect(box!.y + box!.height).toBeLessThanOrEqual(701);
  });

  test("CSS-viewport equivalents of 80–400% zoom keep content readable", async ({ page }) => {
    const failures: string[] = [];
    await ready(page, "/");
    for (const zoom of ZOOM_EQUIVALENT) {
      await page.setViewportSize({ width: zoom.width, height: Math.max(zoom.height, 400) });
      await page.waitForTimeout(250);
      const overflow = await pageOverflow(page);
      const heading = page.getByRole("heading", { name: /fresh clothes/i });
      if (!(await heading.isVisible())) failures.push(`heading hidden at zoom-equivalent ${zoom.label}`);
      if (overflow > 1) failures.push(`overflow ${overflow} at zoom-equivalent ${zoom.label}`);
    }
    await ready(page, "/pricing");
    await page.setViewportSize({ width: 720, height: 450 });
    await expect(page.getByRole("heading").first()).toBeVisible();
    expect(failures, failures.join("\n")).toEqual([]);
    mkdirSync(shotDir, { recursive: true });
    await page.screenshot({ path: join(shotDir, "responsive-pricing-200eq.png") });
  });

  test("CDP page scale (pinch-style zoom) does not throw or overflow the homepage", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "CDP page scale is Chromium-only");
    const errors = await ready(page, "/");
    const session = await page.context().newCDPSession(page);
    for (const scale of [0.8, 1, 1.25, 1.5, 2]) {
      await session.send("Emulation.setPageScaleFactor", { pageScaleFactor: scale });
      await expect(page.getByRole("heading", { name: /fresh clothes/i })).toBeVisible();
      const overflow = await pageOverflow(page);
      expect(overflow, `page scale ${scale}`).toBeLessThanOrEqual(2);
    }
    await session.send("Emulation.setPageScaleFactor", { pageScaleFactor: 1 });
    expect(errors, errors.join("\n")).toEqual([]);
  });

  test("reduced-motion journey remains readable after a resize", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await ready(page, "/");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator("#journey").scrollIntoViewIfNeeded();
    await expect(page.locator("#journey").getByRole("heading", { name: "Wash", exact: true })).toBeVisible();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator("#journey").getByRole("heading", { name: "Pack", exact: true })).toBeVisible();
  });
});
