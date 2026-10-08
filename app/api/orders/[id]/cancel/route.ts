import { NextResponse } from "next/server";
import { CANCELLABLE_STATUSES } from "@/data/order-status";
import { getCurrentUser, getSupabaseAdmin } from "@/lib/supabase/server";
import { AUTH_NOT_CONFIGURED_MESSAGE } from "@/lib/supabase/config";

export async function POST(_request: Request, context: RouteContext<"/api/orders/[id]/cancel">) {
  const { id } = await context.params;
  const { user, supabase } = await getCurrentUser();
  if (!supabase) return NextResponse.json({ error: AUTH_NOT_CONFIGURED_MESSAGE }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "Server is missing the service role key." }, { status: 503 });

  const { data: order } = await supabase
    .from("orders")
    .select("id, status, discount")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  if (!CANCELLABLE_STATUSES.includes(order.status)) {
    return NextResponse.json({ error: "This order can no longer be cancelled from your account. Call the studio." }, { status: 400 });
  }

  const { error } = await admin.from("orders").update({ status: "cancelled", updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await admin.from("order_status_events").insert({ order_id: id, status: "cancelled" });
  if (Number(order.discount) > 0) await admin.rpc("release_first_order_discount", { p_user: user.id });
  return NextResponse.json({ ok: true });
}
