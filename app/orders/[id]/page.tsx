import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CancelOrderButton, ReorderButton } from "@/components/orders/OrderActions";
import { CANCELLABLE_STATUSES, ORDER_STATUSES, statusIndex, statusLabel } from "@/data/order-status";
import { formatINR } from "@/lib/pricing";
import { getCurrentUser } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Order",
  description: "Track a Rinse & Rise laundry order.",
  path: "/orders",
});

export default async function OrderPage({ params }: PageProps<"/orders/[id]">) {
  const { id } = await params;
  const { user, supabase } = await getCurrentUser();
  if (!user) redirect(`/login?next=/orders/${id}`);
  if (!supabase) notFound();

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!order) notFound();

  const idx = statusIndex(order.status);
  const cancelled = order.status === "cancelled";
  const delivered = order.status === "delivered";

  return (
    <div className="container-rr max-w-3xl pb-20 pt-10">
      <p className="eyebrow">Order {order.order_number}</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold">{statusLabel(order.status)}</h1>
      <p className="mt-2 text-muted">
        Pickup {order.pickup_date} · {order.pickup_slot.replace("-", " ")} · {formatINR(Number(order.total))}
      </p>

      <ol className="mt-10 space-y-3">
        {ORDER_STATUSES.map((s, i) => {
          const done = !cancelled && idx >= 0 && i <= idx;
          const current = !cancelled && i === idx;
          return (
            <li key={s.id} className="flex items-center gap-4">
              <span
                className={`grid h-9 w-9 place-items-center rounded-full text-xs font-extrabold ${
                  done ? "bg-orange text-white" : "bg-cream text-muted"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`font-bold ${current ? "text-orange-dark" : done ? "text-ink" : "text-muted"}`}>{s.label}</span>
            </li>
          );
        })}
      </ol>

      <ul className="neo mt-10 divide-y divide-line">
        {(order.order_items as { id: string; name: string; quantity: number; line_total: number }[]).map((item) => (
          <li key={item.id} className="flex justify-between px-5 py-3 text-sm">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span className="font-bold tabular-nums">{formatINR(Number(item.line_total))}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        {CANCELLABLE_STATUSES.includes(order.status) && <CancelOrderButton id={order.id} />}
        {(delivered || cancelled) && (
          <ReorderButton items={(order.order_items as { item_id: string; quantity: number }[]) ?? []} />
        )}
        <Link href="/account/orders" className="btn btn-secondary">
          All orders
        </Link>
        <Link href="/account" className="btn btn-ghost">
          Help
        </Link>
      </div>
    </div>
  );
}
