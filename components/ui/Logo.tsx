import Image from "next/image";
import Link from "next/link";

export function Logo({ compact = false, inverted = false }: { compact?: boolean; inverted?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-3" aria-label="Rinse & Rise Laundryrite — home">
      <span className="relative block h-11 w-11 shrink-0 overflow-hidden rounded-full shadow-[0_6px_16px_rgba(255,106,0,0.28)] ring-2 ring-white transition-transform duration-300 group-hover:rotate-[-6deg]">
        <Image src="/images/logo.png" alt="" fill sizes="44px" className="object-cover" priority />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className={`block font-display text-[1.05rem] font-extrabold tracking-tight ${inverted ? "text-white" : "text-ink"}`}>
            RINSE <span className="text-orange">&amp;</span> RISE
          </span>
          <span className={`mt-1 block text-[0.62rem] font-bold tracking-[0.32em] ${inverted ? "text-white/60" : "text-muted"}`}>
            LAUNDRYRITE
          </span>
        </span>
      )}
    </Link>
  );
}
