"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "./supabase/client";

export type SessionState = { status: "loading" } | { status: "signed-out" } | { status: "signed-in"; user: User };

export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({ status: "loading" });

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setState({ status: "signed-out" });
      return;
    }
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active) setState(data.user ? { status: "signed-in", user: data.user } : { status: "signed-out" });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(session?.user ? { status: "signed-in", user: session.user } : { status: "signed-out" });
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
