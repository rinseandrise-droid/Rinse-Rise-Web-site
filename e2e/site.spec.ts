import { expect, test, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const shotDir = join(process.cwd(), "e2e", "screenshots");

async function shot(page: Page, name: string) {
  mkdirSync(shotDir, { recursive: true });
  await page.screenshot({ path: join(shotDir, `${name}.png`), fullPage: false });
}

async function ready(page: Page, path = "/") {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto(path);
  await page.locator("html[data-hydrated='true']").waitFor({ state: "attached" });
  return { response, errors };
}

async function scrollJourney(page: Page, fraction: number) {
  await page.evaluate((value) => {
    const el = document.querySelector("#journey");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const height = (el as HTMLElement).offsetHeight;
    window.scrollTo(0, top + Math.max(0, height * value));
  }, fraction);
  await page.waitForFunction(
    (value) => {
      const progress = Number(getComputedStyle(document.querySelector("#journey") as HTMLElement).getPropertyValue("--sw-p"));
      return Number.isFinite(progress) && Math.abs(progress - value) < 0.2;
    },
    fraction,
    { timeout: 8000 }
  );
}

test.describe("Rinse & Rise site", () => {
  test("homepage loads without uncaught exceptions", async ({ page }) => {
    const { response, errors } = await ready(page);
    expect(response?.ok()).toBeTruthy();
    await expect(page.getByRole("heading", { name: /fresh clothes/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /book a pickup/i }).first()).toBeVisible();
    await shot(page, "01-homepage-hero");
    expect(errors, errors.join("\n")).toEqual([]);
  });

  test("primary navigation reaches real pages", async ({ page }) => {
    await ready(page);
    for (const { label, url } of [
      { label: "Services", url: /\/services/ },
      { label: "Pricing", url: /\/pricing/ },
      { label: "About", url: /\/about/ },
      { label: "FAQ", url: /\/faq/ },
      { label: "Contact", url: /\/contact/ },
    ]) {
      await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(url);
      await expect(page.getByRole("heading").first()).toBeVisible();
    }
  });

  test("user can scroll the homepage and reach the footer", async ({ page }) => {
    await ready(page);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByRole("contentinfo").getByText(/electronic city/i)).toBeVisible();
    await shot(page, "02-footer");
  });

  test("laundry journey stages appear in order and rewind", async ({ page }) => {
    await ready(page);
    await page.locator("#journey").scrollIntoViewIfNeeded();

    const seen: string[] = [];
    for (const fraction of [0.28, 0.4, 0.48, 0.62, 0.74, 0.82, 0.88, 0.94]) {
      await scrollJourney(page, fraction);
      const live = ((await page.locator("[data-sw-live]").textContent()) ?? "").toLowerCase();
      const match = ["wash", "rinse", "spin", "dry", "press", "quality", "fold", "pack"].find((id) => live.includes(id));
      if (match && seen[seen.length - 1] !== match) seen.push(match);
    }

    expect(seen.length).toBeGreaterThan(3);
    const order = ["wash", "rinse", "spin", "dry", "press", "quality", "fold", "pack"];
    const indexes = seen.map((id) => order.indexOf(id)).filter((n) => n >= 0);
    for (let i = 1; i < indexes.length; i++) {
      expect(indexes[i]).toBeGreaterThanOrEqual(indexes[i - 1]);
    }

    await scrollJourney(page, 0.28);
    const back = ((await page.locator("[data-sw-live]").textContent()) ?? "").toLowerCase();
    expect(back).toMatch(/wash|rinse|spin/);
  });

  test("rapid scrolling and pin release still reach later sections", async ({ page }) => {
    await ready(page);
    await page.evaluate(() => {
      const el = document.querySelector("#journey");
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const height = (el as HTMLElement).offsetHeight;
      window.scrollTo(0, top + height + 240);
    });
    await expect(page.locator("#services")).toBeInViewport({ timeout: 8000 });
  });

  test("booking CTA opens auth gate or booking, never a dead link", async ({ page }) => {
    await ready(page);
    await page.locator("section").first().getByRole("button", { name: /book a pickup/i }).click();
    await expect(page.getByRole("heading", { name: /login required|book/i })).toBeVisible();
  });

  test("mobile navigation opens and closes", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await ready(page);
    await page.setViewportSize({ width: 390, height: 844 });
    const toggle = page.locator('header button[aria-controls="mobile-menu"]');
    await expect(toggle).toBeVisible();
    await toggle.click();
    const menu = page.locator("#mobile-menu");
    await expect(menu.getByRole("link", { name: "Services" })).toBeVisible();
    await shot(page, "03-mobile-nav");
    await page.getByRole("button", { name: /close menu/i }).click();
    await expect(menu).toHaveCount(0);
  });

  test("FAQ accordion toggles and stays keyboard accessible", async ({ page }) => {
    await ready(page, "/faq");
    const first = page.getByRole("button", { name: /how does pickup work/i });
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await first.click();
    await expect(first).toHaveAttribute("aria-expanded", "false");
    await first.click();
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await first.focus();
    await page.keyboard.press("Enter");
    await expect(first).toHaveAttribute("aria-expanded", "false");
  });

  test("layouts do not overflow horizontally at key viewports", async ({ page }) => {
    await ready(page);
    for (const viewport of [
      { width: 320, height: 700 },
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1280, height: 800 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${viewport.width}x${viewport.height} overflow ${overflow}`).toBeLessThanOrEqual(1);
    }
  });

  test("reload at mid-page does not break the document", async ({ page }) => {
    const { errors } = await ready(page);
    await page.evaluate(() => window.scrollTo(0, 1800));
    await page.reload();
    await page.locator("html[data-hydrated='true']").waitFor({ state: "attached" });
    await expect(page.locator("#main")).toBeVisible();
    expect(errors, errors.join("\n")).toEqual([]);
  });

  test("resize during the journey does not freeze the page", async ({ page }) => {
    await ready(page);
    await page.locator("#journey").scrollIntoViewIfNeeded();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator("#journey")).toBeVisible();
    await page.mouse.wheel(0, 800);
    await expect(page.locator("body")).toBeVisible();
  });

  test("contact form validates phone numbers", async ({ page }) => {
    await ready(page, "/contact");
    await page.locator('input[name="name"]').fill("Rudra");
    await page.locator('input[name="phone"]').fill("12345");
    await page.locator('textarea[name="message"]').fill("Need a pickup tomorrow");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByRole("alert").filter({ hasText: /mobile/i })).toBeVisible();
    await page.locator('input[name="phone"]').fill("9591506548");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByRole("heading", { name: /message noted/i })).toBeVisible();
  });

  test("required images and logo resolve", async ({ page }) => {
    const failed: string[] = [];
    page.on("response", (response) => {
      if (response.request().resourceType() === "image" && response.status() >= 400) {
        failed.push(`${response.status()} ${response.url()}`);
      }
    });
    await ready(page);
    await page.goto("/services");
    await page.locator("html[data-hydrated='true']").waitFor({ state: "attached" });
    expect(failed, failed.join("\n")).toEqual([]);
  });

  test("no leftover click-blocking overlay on the hero", async ({ page }) => {
    await ready(page);
    const blocked = await page.evaluate(() => {
      const cta = document.querySelector("h1");
      if (!cta) return true;
      const rect = cta.getBoundingClientRect();
      const el = document.elementFromPoint(rect.left + 20, rect.top + 20);
      return !el || (!cta.contains(el) && !el.closest("h1"));
    });
    expect(blocked).toBeFalsy();
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("reduced-motion journey stays readable", async ({ page }) => {
    await ready(page);
    await page.locator("#journey").scrollIntoViewIfNeeded();
    await expect(page.getByRole("heading", { name: /from hanger to packed/i })).toBeVisible();
    await expect(page.locator("#journey").getByRole("heading", { name: "Wash", exact: true })).toBeVisible();
    await expect(page.locator("#journey").getByRole("heading", { name: "Spin & Extract", exact: true })).toBeVisible();
    await expect(page.locator("#journey").getByRole("heading", { name: "Quality Check", exact: true })).toBeVisible();
    await expect(page.locator("#journey").getByRole("heading", { name: "Pack", exact: true })).toBeVisible();
    await shot(page, "04-reduced-motion-journey");
  });
});
