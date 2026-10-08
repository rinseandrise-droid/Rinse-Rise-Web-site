import { firstOrderOffer } from "@/data/site";
import { getCurrentUser } from "@/lib/supabase/server";
import Link from "next/link";

export default async function OffersPage() {
  const { user, supabase } = await getCurrentUser();
  if (!user || !supabase) return null;
  const { data: profile } = await supabase.from("profiles").select("first_order_discount_used").eq("id", user.id).maybeSingle();
  const used = Boolean(profile?.first_order_discount_used);

  return (
    <div className="neo max-w-lg p-8">
      <h1 className="font-display text-3xl font-extrabold">Offers</h1>
      <p className="mt-4 font-display text-5xl font-extrabold text-orange">{firstOrderOffer.percent}%</p>
      <p className="mt-2 font-bold">{firstOrderOffer.headline}</p>
      <p className="mt-3 text-sm text-muted">
        {used
          ? "Already redeemed on an earlier order. Thank you for trying Rinse & Rise."
          : "Attached to this account. Applied automatically on your first confirmed booking."}
      </p>
      {!used && (
        <Link href="/book" className="btn btn-primary mt-6">
          Use it on a booking
        </Link>
      )}
    </div>
  );
}
