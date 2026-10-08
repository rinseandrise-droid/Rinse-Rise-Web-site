import { Suspense } from "react";
import { LoginForm } from "@/components/auth/AuthForms";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Login",
  description: "Sign in to book a pickup, track orders and use your first-order offer.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <>
      <PageHeader eyebrow="Account" title="Welcome back." />
      <div className="container-rr max-w-md pb-20">
        <div className="neo p-7">
          <Suspense fallback={<p className="text-muted">Loading…</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </>
  );
}
