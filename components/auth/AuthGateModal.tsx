"use client";

import { Lock, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { firstOrderOffer } from "@/data/site";
import { closeAuthGate, useAuthGate } from "@/lib/ui-store";

export function AuthGateModal() {
  const gate = useAuthGate();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (gate.open && !dialog.open) dialog.showModal();
    if (!gate.open && dialog.open) dialog.close();
  }, [gate.open]);

  const next = encodeURIComponent(gate.next);

  return (
    <dialog
      ref={dialogRef}
      onClose={closeAuthGate}
      onClick={(e) => e.target === dialogRef.current && closeAuthGate()}
      aria-labelledby="auth-gate-title"
      className="m-auto max-h-[min(90dvh,640px)] w-[min(92vw,440px)] overflow-y-auto rounded-[24px] bg-transparent p-0 backdrop:bg-ink/45 backdrop:backdrop-blur-sm sm:rounded-[28px]"
    >
      <div className="neo relative p-6 sm:p-8">
        <button
          type="button"
          onClick={closeAuthGate}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-cream hover:text-ink"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-orange-tint text-orange">
          <Lock className="h-6 w-6" aria-hidden />
        </span>
        <h2 id="auth-gate-title" className="mt-5 text-2xl font-extrabold">
          Login required
        </h2>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
          {gate.reason ||
            `Create your account to book your laundry pickup and unlock your ${firstOrderOffer.percent}% first-order offer.`}
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link href={`/login?next=${next}`} onClick={closeAuthGate} className="btn btn-secondary">
            Login
          </Link>
          <Link href={`/signup?next=${next}`} onClick={closeAuthGate} className="btn btn-primary">
            Create Account
          </Link>
        </div>
      </div>
    </dialog>
  );
}
