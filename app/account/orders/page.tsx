import Link from "next/link";
import { statusLabel } from "@/data/order-status";
import { formatINR } from "@/lib/pricing";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function AccountOrdersPage() {
  const { user, supabase } = await getCurrentUser();
  if (!user || !supabase) return null;
  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, status, total, created_at")
    .order("created_at", { ascending: false });

  if (!orders?.length) {
    return (
      <div className="neo p-10 text-center">
        <h1 className="font-display text-2xl font-extrabold">No orders yet.</h1>
        <Link href="/book" className="btn btn-primary mt-6">
          Book your first pickup
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Orders</h1>
      <ul className="mt-6 space-y-3">
        {orders.map((o) => (
          <li key={o.id}>
            <Link href={`/orders/${o.id}`} className="neo-sm flex flex-wrap items-center justify-between gap-3 p-4">
              <span className="font-bold">#{o.order_number}</span>
              <span className="text-sm text-muted">{statusLabel(o.status)}</span>
              <span className="font-extrabold tabular-nums">{formatINR(Number(o.total))}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
