"use client";

import { useRouter } from "next/navigation";
import { cart } from "@/lib/cart";
import { toast } from "@/lib/ui-store";

export function CancelOrderButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={async () => {
        if (!confirm("Cancel this pickup?")) return;
        const res = await fetch(`/api/orders/${id}/cancel`, { method: "POST" });
        const body = (await res.json()) as { error?: string };
        if (!res.ok) {
          toast(body.error || "Could not cancel", "error");
          return;
        }
        toast("Order cancelled", "info");
        router.refresh();
      }}
    >
      Cancel order
    </button>
  );
}

export function ReorderButton({ items }: { items: { item_id: string; quantity: number }[] }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={() => {
        cart.replace(items.map((i) => ({ itemId: i.item_id, quantity: Number(i.quantity) })));
        toast("Items added at current rates");
        router.push("/book");
      }}
    >
      Reorder
    </button>
  );
}
