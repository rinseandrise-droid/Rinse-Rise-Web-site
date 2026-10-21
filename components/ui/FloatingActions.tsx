"use client";

import { ArrowUp, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { site, whatsappLink } from "@/data/site";

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("back-to-top-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setShowTop(entry.boundingClientRect.top < 0));
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed right-3 z-[60] flex flex-col items-end gap-3 max-md:bottom-[max(0.75rem,var(--safe-bottom))] sm:right-6 sm:bottom-6">
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="grid h-11 w-11 place-items-center rounded-full neo-sm transition-transform hover:-translate-y-0.5"
          aria-label="Back to top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 rounded-full bg-[#1fa855] p-3.5 text-white shadow-[0_14px_30px_rgba(31,168,85,0.35)] transition-transform hover:-translate-y-0.5 md:py-2.5 md:pl-3 md:pr-5"
        aria-label={`Chat with Rinse & Rise on WhatsApp, ${site.phoneDisplay}`}
      >
        <MessageCircle className="h-6 w-6 md:h-5 md:w-5" aria-hidden />
        <span className="hidden text-left leading-tight md:block">
          <span className="block text-[0.7rem] font-semibold opacity-80">Questions?</span>
          <span className="block text-sm font-extrabold">WhatsApp us</span>
        </span>
      </a>
    </div>
  );
}
