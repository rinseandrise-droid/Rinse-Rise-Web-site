"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import type { FaqItem } from "@/data/faq";

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line rounded-[28px] border border-line bg-white">
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
          className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-display text-lg font-bold sm:px-7"
        >
          {item.q}
          <ChevronDown className={`h-5 w-5 shrink-0 text-orange transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
        </button>
      </h3>
      <div id={id} hidden={!open} className="px-5 pb-5 text-sm leading-relaxed text-muted sm:px-7">
        {item.a}
      </div>
    </div>
  );
}
