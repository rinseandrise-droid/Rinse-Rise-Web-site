"use client";

import { useCallback, useEffect, useState } from "react";
import { AddressForm } from "@/components/booking/AddressForm";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { toast } from "@/lib/ui-store";

type Address = { id: string; label: string; name: string; line1: string; city: string; pincode: string };

export default function AddressesPage() {
  const [rows, setRows] = useState<Address[]>([]);
  const load = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const { data } = await supabase.from("addresses").select("*").order("created_at", { ascending: false });
    setRows((data as Address[]) ?? []);
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-extrabold">Saved addresses</h1>
      <ul className="mt-6 space-y-3">
        {rows.map((a) => (
          <li key={a.id} className="neo-sm flex items-start justify-between gap-3 p-4">
            <span>
              <span className="badge">{a.label}</span>
              <span className="mt-1 block font-bold">{a.name}</span>
              <span className="text-sm text-muted">
                {a.line1}, {a.city} {a.pincode}
              </span>
            </span>
            <button
              type="button"
              className="text-xs font-bold text-danger"
              onClick={async () => {
                const supabase = getSupabaseBrowser();
                if (!supabase) return;
                await supabase.from("addresses").delete().eq("id", a.id);
                toast("Address removed", "info");
                void load();
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <h2 className="mt-10 font-display text-xl font-extrabold">Add address</h2>
      <AddressForm onSaved={() => void load()} />
    </div>
  );
}
