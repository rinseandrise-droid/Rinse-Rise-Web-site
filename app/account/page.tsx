import Link from "next/link";
import { BookPickupButton } from "@/components/ui/BookPickupButton";
import { firstOrderOffer } from "@/data/site";
import { statusLabel } from "@/data/order-status";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function AccountHomePage() {
  const { user, supabase } = await getCurrentUser();
  if (!user || !supabase) return null;
  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("orders").select("id, order_number, status, total, created_at").order("created_at", { ascending: false }).limit(5),
  ]);
  const active = (orders ?? []).filter((o) => o.status !== "delivered" && o.status !== "cancelled");

  return (
    <div className="grid gap-6">
      <div className="neo p-7">
        <p className="eyebrow">Overview</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold">Hello{profile?.full_name ? `, ${profile.full_name}` : ""}.</h1>
        <p className="mt-2 text-muted">{user.email}</p>
        <div className="mt-6">
          <BookPickupButton />
        </div>
      </div>
      <div className="neo-sm p-6">
        <h2 className="font-display text-xl font-extrabold">Offers</h2>
        <p className="mt-2 text-sm text-muted">
          {profile?.first_order_discount_used
            ? "Your first-order offer has been used."
            : `${firstOrderOffer.percent}% off is waiting on your first order.`}
        </p>
      </div>
      <section>
        <h2 className="font-display text-xl font-extrabold">Active orders</h2>
        {active.length === 0 ? (
          <p className="mt-3 text-muted">No orders in progress.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {active.map((o) => (
              <li key={o.id}>
                <Link href={`/orders/${o.id}`} className="neo-sm flex items-center justify-between p-4">
                  <span className="font-bold">#{o.order_number}</span>
                  <span className="text-sm text-muted">{statusLabel(o.status)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
