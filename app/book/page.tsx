import { redirect } from "next/navigation";
import { BookFlow } from "@/components/booking/BookFlow";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Book a pickup",
  description: "Build your order, choose an address and schedule a Rinse & Rise pickup.",
  path: "/book",
});

export default async function BookPage() {
  if (!isSupabaseConfigured()) {
    return (
      <>
        <PageHeader eyebrow="Book" title="Booking needs accounts switched on." description="Add the Supabase keys from .env.example to enable sign-in and pickup booking." />
      </>
    );
  }
  const { user, supabase } = await getCurrentUser();
  if (!user) redirect("/login?next=/book");

  const { data: profile } = await supabase!
    .from("profiles")
    .select("first_order_discount_used")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <>
      <PageHeader eyebrow="Book a pickup" title="Build the order. We'll come to you." />
      <div className="container-rr pb-20">
        <BookFlow firstOrderEligible={!profile?.first_order_discount_used} />
      </div>
    </>
  );
}
