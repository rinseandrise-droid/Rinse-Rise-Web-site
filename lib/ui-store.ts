"use client";

import { useSyncExternalStore } from "react";

function createStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => state,
    set(next: T) {
      state = next;
      listeners.forEach((l) => l());
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

// ───────────── Toasts ─────────────
export interface Toast {
  id: number;
  message: string;
  tone: "success" | "error" | "info";
}

const toastStore = createStore<Toast[]>([]);
let toastId = 0;

export function toast(message: string, tone: Toast["tone"] = "success") {
  const id = ++toastId;
  toastStore.set([...toastStore.get().slice(-2), { id, message, tone }]);
  window.setTimeout(() => dismissToast(id), 3200);
}

export function dismissToast(id: number) {
  toastStore.set(toastStore.get().filter((t) => t.id !== id));
}

const NO_TOASTS: Toast[] = [];
export function useToasts() {
  return useSyncExternalStore(toastStore.subscribe, toastStore.get, () => NO_TOASTS);
}

// ───────────── Login-required gate ─────────────
interface AuthGate {
  open: boolean;
  next: string;
  reason: string;
}

const gateStore = createStore<AuthGate>({ open: false, next: "/book", reason: "" });

export function openAuthGate(next = "/book", reason = "") {
  gateStore.set({ open: true, next, reason });
}

export function closeAuthGate() {
  gateStore.set({ ...gateStore.get(), open: false });
}

const CLOSED_GATE: AuthGate = { open: false, next: "/book", reason: "" };
export function useAuthGate() {
  return useSyncExternalStore(gateStore.subscribe, gateStore.get, () => CLOSED_GATE);
}
