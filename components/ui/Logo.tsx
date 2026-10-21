import Image from "next/image";
import Link from "next/link";

export function Logo({ compact = false, inverted = false }: { compact?: boolean; inverted?: boolean }) {
  return (
    <Link href="/" className="group inline-flex min-w-0 items-center gap-2 sm:gap-3" aria-label="Rinse & Rise Laundryrite — home">
      <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-full shadow-[0_6px_16px_rgba(255,106,0,0.28)] ring-2 ring-white transition-transform duration-300 group-hover:rotate-[-6deg] sm:h-11 sm:w-11">
        <Image src="/images/logo.png" alt="" fill sizes="44px" className="object-cover" priority />
      </span>
      {!compact && (
        <span className="min-w-0 leading-none">
          <span className={`block truncate font-display text-[0.92rem] font-extrabold tracking-tight sm:text-[1.05rem] ${inverted ? "text-white" : "text-ink"}`}>
            RINSE <span className="text-orange">&amp;</span> RISE
          </span>
          <span className={`mt-0.5 hidden text-[0.62rem] font-bold tracking-[0.32em] min-[400px]:block ${inverted ? "text-white/60" : "text-muted"}`}>
            LAUNDRYRITE
          </span>
        </span>
      )}
    </Link>
  );
}
