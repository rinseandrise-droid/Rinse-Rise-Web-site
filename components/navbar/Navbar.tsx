"use client";

import { Menu, ShoppingBag, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks } from "@/data/site";
import { useCart } from "@/lib/cart";
import { useSession } from "@/lib/use-session";
import { BookPickupButton } from "../ui/BookPickupButton";
import { Logo } from "../ui/Logo";
import { AnnouncementBar } from "./AnnouncementBar";

export function Navbar() {
  const pathname = usePathname();
  const session = useSession();
  const cartLines = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("nav-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => {
      if (window.innerWidth >= 1280) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href));
  const signedIn = session.status === "signed-in";

  return (
    <>
      <div id="nav-sentinel" aria-hidden className="h-0" />
      <header
        className={`sticky top-0 z-40 pt-[var(--safe-top)] transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          scrolled || open ? "bg-canvas/90 shadow-[0_8px_30px_rgba(150,110,80,0.12)] backdrop-blur-xl" : "bg-canvas"
        }`}
      >
        <AnnouncementBar />
        <nav className="container-rr flex h-[var(--nav-h)] items-center justify-between gap-2 sm:gap-4" aria-label="Main">
          <Logo />

          <ul className="hidden items-center gap-0.5 xl:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className="relative rounded-full px-2.5 py-2 text-[0.84rem] font-semibold text-ink/80 transition-colors hover:text-orange-dark 2xl:px-3 2xl:text-[0.88rem] aria-[current=page]:text-orange-dark"
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-orange" aria-hidden />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link
              href="/book"
              className="relative grid h-10 w-10 place-items-center rounded-full neo-sm transition-transform hover:-translate-y-0.5 sm:h-11 sm:w-11"
              aria-label={`Your order, ${cartLines.length} item${cartLines.length === 1 ? "" : "s"}`}
            >
              <ShoppingBag className="h-[18px] w-[18px]" aria-hidden />
              {cartLines.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-orange px-1 text-[0.65rem] font-extrabold text-white">
                  {cartLines.length}
                </span>
              )}
            </Link>
            <Link href={signedIn ? "/account" : "/login"} className="btn btn-ghost btn-sm hidden lg:inline-flex">
              {signedIn ? (
                <>
                  <User className="h-4 w-4" aria-hidden /> Account
                </>
              ) : (
                "Login"
              )}
            </Link>
            <BookPickupButton size="sm" className="hidden lg:inline-flex" showArrow={false} />
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full neo-sm sm:h-11 sm:w-11 xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {open && (
          <div
            id="mobile-menu"
            className="fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-canvas xl:hidden"
            style={{ top: "var(--header-stack)" }}
          >
            <div className="container-rr flex min-h-full flex-col gap-1 py-5 pb-24">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className="rounded-2xl px-4 py-3.5 font-display text-xl font-bold sm:text-2xl aria-[current=page]:bg-orange-tint aria-[current=page]:text-orange-dark"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 grid gap-3 sm:max-w-sm">
                <Link href={signedIn ? "/account" : "/login"} onClick={() => setOpen(false)} className="btn btn-secondary">
                  {signedIn ? "My Account" : "Login"}
                </Link>
                <BookPickupButton className="w-full" onActivate={() => setOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
