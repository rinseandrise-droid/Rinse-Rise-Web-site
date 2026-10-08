"use client";

import { Minus, Plus } from "lucide-react";
import type { ServiceItem } from "@/data/services";
import { QUANTITY_LIMITS } from "@/lib/pricing";

export function QuantityStepper({
  item,
  value,
  onChange,
}: {
  item: ServiceItem;
  value: number;
  onChange: (next: number) => void;
}) {
  const limits = QUANTITY_LIMITS[item.unit];
  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        className="grid h-9 w-9 place-items-center rounded-full neo-sm"
        aria-label={`Decrease ${item.name}`}
        onClick={() => onChange(value - limits.step)}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-12 text-center text-sm font-extrabold tabular-nums">
        {value} {item.unit === "kg" ? "kg" : item.unit === "sq" ? "sq" : ""}
      </span>
      <button
        type="button"
        className="grid h-9 w-9 place-items-center rounded-full neo-sm"
        aria-label={`Increase ${item.name}`}
        onClick={() => onChange(value + limits.step)}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
