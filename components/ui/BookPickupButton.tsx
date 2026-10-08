"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useSession } from "@/lib/use-session";
import { openAuthGate } from "@/lib/ui-store";

/** The single primary CTA. Visible to everyone; booking itself requires an account. */
export function BookPickupButton({
  className = "",
  size = "md",
  children = "Book a Pickup",
  showArrow = true,
  onActivate,
}: {
  className?: string;
  size?: "sm" | "md";
  children?: ReactNode;
  showArrow?: boolean;
  onActivate?: () => void;
}) {
  const router = useRouter();
  const session = useSession();

  return (
    <button
      type="button"
      className={`btn btn-primary ${size === "sm" ? "btn-sm" : ""} ${className}`}
      onClick={() => {
        onActivate?.();
        if (session.status === "signed-in") router.push("/book");
        else openAuthGate("/book");
      }}
    >
      {children}
      {showArrow && <ArrowRight className="btn-arrow h-4 w-4" aria-hidden />}
    </button>
  );
}
