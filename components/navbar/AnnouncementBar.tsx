import Link from "next/link";
import { Sparkles } from "lucide-react";
import { firstOrderOffer } from "@/data/site";

export function AnnouncementBar() {
  return (
    <div className="relative z-50 h-[var(--announce-h)] bg-ink text-white">
      <div className="container-rr flex h-full items-center justify-center gap-2 text-[0.7rem] font-semibold sm:gap-3 sm:text-sm">
        <Sparkles className="hidden h-4 w-4 shrink-0 text-orange-soft min-[360px]:block" aria-hidden />
        <p className="min-w-0 truncate">
          <span className="font-extrabold tracking-wide text-orange-soft">GET {firstOrderOffer.percent}% OFF</span>{" "}
          <span className="hidden min-[400px]:inline">YOUR FIRST ORDER</span>
        </p>
        <Link
          href="/signup?offer=first-order"
          className="shrink-0 rounded-full border border-white/25 px-2.5 py-0.5 text-[0.62rem] font-extrabold tracking-[0.08em] transition-colors hover:border-orange hover:bg-orange sm:px-3 sm:py-1 sm:text-[0.7rem] sm:tracking-[0.12em]"
        >
          CLAIM
          <span className="hidden min-[420px]:inline"> OFFER</span>
        </Link>
      </div>
    </div>
  );
}
