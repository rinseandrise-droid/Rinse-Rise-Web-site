import { Suspense } from "react";
import { SignupForm } from "@/components/auth/AuthForms";
import { PageHeader } from "@/components/ui/PageHeader";
import { firstOrderOffer } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Create account",
  description: `Create a Rinse & Rise account and unlock ${firstOrderOffer.percent}% off your first order.`,
  path: "/signup",
});

export default function SignupPage() {
  return (
    <>
      <PageHeader eyebrow="Account" title="Create your account." description={`${firstOrderOffer.percent}% off your first order, applied once at checkout.`} />
      <div className="container-rr max-w-md pb-20">
        <div className="neo p-7">
          <Suspense fallback={<p className="text-muted">Loading…</p>}>
            <SignupForm />
          </Suspense>
        </div>
      </div>
    </>
  );
}
