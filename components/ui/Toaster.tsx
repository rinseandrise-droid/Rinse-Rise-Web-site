"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { dismissToast, useToasts } from "@/lib/ui-store";

const ICONS = { success: CheckCircle2, error: XCircle, info: Info };

export function Toaster() {
  const toasts = useToasts();
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:pr-6"
      role="status"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const Icon = ICONS[t.tone];
        return (
          <div
            key={t.id}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold shadow-[0_18px_40px_rgba(150,110,80,0.22)]"
          >
            <Icon
              className={`h-5 w-5 shrink-0 ${t.tone === "error" ? "text-danger" : t.tone === "info" ? "text-ink" : "text-orange"}`}
              aria-hidden
            />
            <span className="flex-1">{t.message}</span>
            <button type="button" onClick={() => dismissToast(t.id)} aria-label="Dismiss" className="text-muted hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
