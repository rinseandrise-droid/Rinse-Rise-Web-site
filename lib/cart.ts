"use client";

import { useSyncExternalStore } from "react";
import { getItem } from "@/data/services";
import { normaliseQuantity, type CartLine } from "./pricing";

/** Cart holds item ids and quantities only — prices are always re-derived from the rate card. */

const STORAGE_KEY = "rr-cart-v1";
const EMPTY: CartLine[] = [];

let lines: CartLine[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as CartLine[];
    lines = Array.isArray(raw)
      ? raw.filter((l) => l && typeof l.itemId === "string" && getItem(l.itemId) && l.quantity > 0)
      : EMPTY;
  } catch {
    lines = EMPTY;
  }
}

function commit(next: CartLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage may be unavailable (private mode) — cart still works in memory */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      hydrated = false;
      hydrate();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  hydrate();
  return lines;
}

export function useCart(): CartLine[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

export const cart = {
  add(itemId: string, quantity?: number) {
    const item = getItem(itemId);
    if (!item) return;
    hydrate();
    const existing = lines.find((l) => l.itemId === itemId);
    const nextQty = normaliseQuantity(item, (existing?.quantity ?? 0) + (quantity ?? 1));
    commit(
      existing
        ? lines.map((l) => (l.itemId === itemId ? { ...l, quantity: nextQty } : l))
        : [...lines, { itemId, quantity: nextQty }]
    );
  },
  setQuantity(itemId: string, quantity: number) {
    const item = getItem(itemId);
    if (!item) return;
    hydrate();
    if (quantity <= 0) return cart.remove(itemId);
    const nextQty = normaliseQuantity(item, quantity);
    commit(lines.map((l) => (l.itemId === itemId ? { ...l, quantity: nextQty } : l)));
  },
  remove(itemId: string) {
    hydrate();
    commit(lines.filter((l) => l.itemId !== itemId));
  },
  clear() {
    commit(EMPTY);
  },
  replace(next: CartLine[]) {
    commit(next.filter((l) => getItem(l.itemId) && l.quantity > 0));
  },
  count(current: CartLine[]) {
    return current.length;
  },
};
