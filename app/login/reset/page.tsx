import { ResetForm } from "@/components/auth/AuthForms";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Reset password",
  description: "Reset your Rinse & Rise account password.",
  path: "/login/reset",
});

export default function ResetPage() {
  return (
    <>
      <PageHeader eyebrow="Account" title="Reset your password." />
      <div className="container-rr max-w-md pb-20">
        <div className="neo p-7">
          <ResetForm />
        </div>
      </div>
    </>
  );
}
