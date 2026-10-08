import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/server";
import { AUTH_NOT_CONFIGURED_MESSAGE } from "@/lib/supabase/config";

export async function GET(_request: Request, context: RouteContext<"/api/orders/[id]">) {
  const { id } = await context.params;
  const { user, supabase } = await getCurrentUser();
  if (!supabase) return NextResponse.json({ error: AUTH_NOT_CONFIGURED_MESSAGE }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Sign in to view this order." }, { status: 401 });

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*), order_status_events(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  return NextResponse.json({ order: data });
}
