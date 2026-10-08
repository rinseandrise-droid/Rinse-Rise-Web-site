import { redirect } from "next/navigation";
import { AccountNav } from "@/components/account/AccountNav";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function AccountLayout({ children }: LayoutProps<"/account">) {
  if (!isSupabaseConfigured()) {
    return <div className="container-rr py-16 text-muted">Accounts are not switched on yet. Add Supabase keys to continue.</div>;
  }
  const { user } = await getCurrentUser();
  if (!user) redirect("/login?next=/account");
  return (
    <div className="container-rr pb-20 pt-8">
      <AccountNav />
      <div className="mt-8">{children}</div>
    </div>
  );
}
