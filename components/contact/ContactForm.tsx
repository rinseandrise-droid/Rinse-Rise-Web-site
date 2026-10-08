"use client";

import { useState } from "react";
import { site } from "@/data/site";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  if (status === "sent") {
    return (
      <div className="neo p-8">
        <h2 className="font-display text-2xl font-extrabold">Message noted</h2>
        <p className="mt-3 text-muted">
          This form stores your note in this browser for now. For a fast reply, WhatsApp or call {site.phoneDisplay}.
        </p>
      </div>
    );
  }

  return (
    <form
      className="neo grid gap-4 p-8"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        try {
          const notes = JSON.parse(localStorage.getItem("rr-contact-notes") ?? "[]") as unknown[];
          notes.push({
            name: data.get("name"),
            phone: data.get("phone"),
            message: data.get("message"),
            at: new Date().toISOString(),
          });
          localStorage.setItem("rr-contact-notes", JSON.stringify(notes.slice(-20)));
        } catch {
          /* ignore */
        }
        setStatus("sent");
      }}
    >
      <h2 className="font-display text-2xl font-extrabold">Send a note</h2>
      <label>
        <span className="field-label">Name</span>
        <input className="input" name="name" autoComplete="name" required />
      </label>
      <label>
        <span className="field-label">Mobile</span>
        <input className="input" name="phone" type="tel" inputMode="numeric" autoComplete="tel" required />
      </label>
      <label>
        <span className="field-label">Message</span>
        <textarea className="input min-h-32 py-3" name="message" required maxLength={800} />
      </label>
      <button type="submit" className="btn btn-primary mt-2">
        Send
      </button>
      <p className="text-xs text-muted">
        Prefer a live reply? WhatsApp or call us — this form does not yet email the studio.
      </p>
    </form>
  );
}
