import { getItem, type ServiceItem } from "@/data/services";
import { fees as feeConfig, firstOrderOffer } from "@/data/site";

/**
 * The one pricing engine. Cart, checkout, order summary and the order API all call
 * calculateOrderTotal so totals can never drift between screens and the server.
 * Inputs are item ids + quantities only — rates always come from the rate card.
 */

export interface CartLine {
  itemId: string;
  quantity: number;
}

export interface PricedLine {
  item: ServiceItem;
  quantity: number;
  lineTotal: number;
}

export interface Charge {
  id: string;
  label: string;
  amount: number;
}

export interface OrderTotals {
  lines: PricedLine[];
  /** Item ids that were not found in the current rate card. */
  unknownItemIds: string[];
  subtotal: number;
  discount: number;
  discountLabel: string | null;
  charges: Charge[];
  tax: number;
  total: number;
  hasWeightedItems: boolean;
}

export const QUANTITY_LIMITS = {
  piece: { min: 1, max: 200, step: 1 },
  sq: { min: 1, max: 2000, step: 1 },
  kg: { min: 0.5, max: 100, step: 0.5 },
} as const;

const rupees = (value: number) => Math.round(value * 100) / 100;

export function normaliseQuantity(item: ServiceItem, quantity: number): number {
  const limits = QUANTITY_LIMITS[item.unit];
  if (!Number.isFinite(quantity)) return limits.min;
  const stepped = Math.round(quantity / limits.step) * limits.step;
  return Math.min(limits.max, Math.max(limits.min, rupees(stepped)));
}

export function calculateOrderTotal({
  lines,
  applyFirstOrderDiscount,
}: {
  lines: CartLine[];
  applyFirstOrderDiscount: boolean;
}): OrderTotals {
  const merged = new Map<string, number>();
  for (const line of lines) {
    merged.set(line.itemId, (merged.get(line.itemId) ?? 0) + line.quantity);
  }

  const priced: PricedLine[] = [];
  const unknownItemIds: string[] = [];
  for (const [itemId, rawQty] of merged) {
    const item = getItem(itemId);
    if (!item) {
      unknownItemIds.push(itemId);
      continue;
    }
    const quantity = normaliseQuantity(item, rawQty);
    priced.push({ item, quantity, lineTotal: rupees(item.rate * quantity) });
  }

  const subtotal = rupees(priced.reduce((sum, l) => sum + l.lineTotal, 0));
  const discount =
    applyFirstOrderDiscount && subtotal > 0 ? Math.round((subtotal * firstOrderOffer.percent) / 100) : 0;

  const charges: Charge[] = [
    { id: "pickup", label: "Pickup", amount: feeConfig.pickup },
    { id: "delivery", label: "Delivery", amount: feeConfig.delivery },
  ];
  const chargesTotal = charges.reduce((sum, c) => sum + c.amount, 0);
  const taxable = Math.max(0, subtotal - discount) + chargesTotal;
  const tax = rupees(taxable * feeConfig.taxRate);

  return {
    lines: priced,
    unknownItemIds,
    subtotal,
    discount,
    discountLabel: discount > 0 ? `First order ${firstOrderOffer.percent}% off (${firstOrderOffer.code})` : null,
    charges,
    tax,
    total: rupees(taxable + tax),
    hasWeightedItems: priced.some((l) => l.item.unit === "kg" || l.item.unit === "sq"),
  };
}

export function formatINR(value: number): string {
  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}
