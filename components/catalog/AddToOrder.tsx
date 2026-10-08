"use client";

import { cart } from "@/lib/cart";
import { toast } from "@/lib/ui-store";
import type { ServiceItem } from "@/data/services";

export function AddToOrder({ item, className = "" }: { item: ServiceItem; className?: string }) {
  return (
    <button
      type="button"
      className={`btn btn-primary btn-sm ${className}`}
      onClick={() => {
        cart.add(item.id);
        toast(`Added ${item.name} to order`);
      }}
    >
      Add to order
    </button>
  );
}
