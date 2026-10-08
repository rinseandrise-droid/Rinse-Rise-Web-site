import Link from "next/link";
import { Sparkles } from "lucide-react";
import { firstOrderOffer } from "@/data/site";

export function AnnouncementBar() {
  return (
    <div className="relative z-50 h-[var(--announce-h)] bg-ink text-white">
      <div className="container-rr flex h-full items-center justify-center gap-3 text-[0.78rem] font-semibold sm:text-sm">
        <Sparkles className="h-4 w-4 shrink-0 text-orange-soft" aria-hidden />
        <p className="truncate">
          <span className="font-extrabold tracking-wide text-orange-soft">GET {firstOrderOffer.percent}% OFF</span>{" "}
          <span className="hidden min-[380px]:inline">YOUR FIRST ORDER</span>
        </p>
        <Link
          href="/signup?offer=first-order"
          className="shrink-0 rounded-full border border-white/25 px-3 py-1 text-[0.7rem] font-extrabold tracking-[0.12em] transition-colors hover:border-orange hover:bg-orange"
        >
          CLAIM OFFER
        </Link>
      </div>
    </div>
  );
}
