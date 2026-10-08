import { NextResponse } from "next/server";
import { CANCELLABLE_STATUSES } from "@/data/order-status";
import { firstOrderOffer } from "@/data/site";
import { calculateOrderTotal } from "@/lib/pricing";
import { getCurrentUser, getSupabaseAdmin } from "@/lib/supabase/server";
import { AUTH_NOT_CONFIGURED_MESSAGE } from "@/lib/supabase/config";
import { orderRequestSchema } from "@/lib/validation";

export async function GET() {
  const { user, supabase } = await getCurrentUser();
  if (!supabase) return NextResponse.json({ error: AUTH_NOT_CONFIGURED_MESSAGE }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Sign in to view orders." }, { status: 401 });

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data ?? [] });
}

export async function POST(request: Request) {
  const { user, supabase } = await getCurrentUser();
  if (!supabase) return NextResponse.json({ error: AUTH_NOT_CONFIGURED_MESSAGE }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Sign in to book a pickup." }, { status: 401 });

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Server is missing SUPABASE_SERVICE_ROLE_KEY. Orders cannot be created yet." },
      { status: 503 }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = orderRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid booking." }, { status: 400 });
  }

  const { data: address, error: addressError } = await supabase
    .from("addresses")
    .select("*")
    .eq("id", parsed.data.addressId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (addressError || !address) {
    return NextResponse.json({ error: "Choose a saved pickup address." }, { status: 400 });
  }

  const { data: claimed, error: claimError } = await admin.rpc("claim_first_order_discount", { p_user: user.id });
  if (claimError) {
    return NextResponse.json({ error: "Could not check first-order offer." }, { status: 500 });
  }
  const applyFirstOrderDiscount = Boolean(claimed);

  const totals = calculateOrderTotal({
    lines: parsed.data.items,
    applyFirstOrderDiscount,
  });
  if (totals.unknownItemIds.length) {
    if (applyFirstOrderDiscount) await admin.rpc("release_first_order_discount", { p_user: user.id });
    return NextResponse.json({ error: "One of the items is no longer on the rate card. Refresh and try again." }, { status: 400 });
  }
  if (!totals.lines.length) {
    if (applyFirstOrderDiscount) await admin.rpc("release_first_order_discount", { p_user: user.id });
    return NextResponse.json({ error: "Add at least one item." }, { status: 400 });
  }

  const chargesTotal = totals.charges.reduce((s, c) => s + c.amount, 0);
  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pickup_scheduled",
      address,
      pickup_date: parsed.data.pickupDate,
      pickup_slot: parsed.data.pickupSlot,
      notes: parsed.data.notes,
      subtotal: totals.subtotal,
      discount: totals.discount,
      coupon_code: applyFirstOrderDiscount ? firstOrderOffer.code : null,
      charges: chargesTotal,
      tax: totals.tax,
      total: totals.total,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    if (applyFirstOrderDiscount) await admin.rpc("release_first_order_discount", { p_user: user.id });
    return NextResponse.json({ error: orderError?.message ?? "Could not create the order." }, { status: 500 });
  }

  const { error: itemsError } = await admin.from("order_items").insert(
    totals.lines.map((line) => ({
      order_id: order.id,
      item_id: line.item.id,
      service_id: line.item.serviceId,
      group_name: line.item.groupId,
      name: line.item.name,
      unit: line.item.unit,
      rate: line.item.rate,
      quantity: line.quantity,
      line_total: line.lineTotal,
    }))
  );
  if (itemsError) {
    await admin.from("orders").delete().eq("id", order.id);
    if (applyFirstOrderDiscount) await admin.rpc("release_first_order_discount", { p_user: user.id });
    return NextResponse.json({ error: "Could not save order items." }, { status: 500 });
  }

  await admin.from("order_status_events").insert({ order_id: order.id, status: "pickup_scheduled" });

  return NextResponse.json({ ok: true, id: order.id, orderNumber: order.order_number, cancellable: CANCELLABLE_STATUSES });
}
