"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import type { FaqItem } from "@/data/faq";

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-white sm:rounded-[28px]">
      {items.map((item, i) => (
        <FaqRow key={item.q} item={item} defaultOpen={i === 0} />
      ))}
    </div>
  );
}

function FaqRow({ item, defaultOpen }: { item: FaqItem; defaultOpen: boolean }) {
  const id = useId();
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left font-display text-[1.05rem] font-bold sm:gap-4 sm:px-7 sm:py-5 sm:text-lg"
        >
          {item.q}
          <ChevronDown className={`h-5 w-5 shrink-0 text-orange transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
        </button>
      </h3>
      <div id={id} hidden={!open} className="px-4 pb-4 text-sm leading-relaxed text-muted sm:px-7 sm:pb-5">
        {item.a}
      </div>
    </div>
  );
}
