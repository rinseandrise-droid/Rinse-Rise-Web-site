export const ORDER_STATUSES = [
  { id: "pickup_scheduled", label: "Pickup Scheduled", stage: "intro" },
  { id: "picked_up", label: "Picked Up", stage: "intro" },
  { id: "received", label: "Received at Facility", stage: "intro" },
  { id: "sorting", label: "Sorting", stage: "intro" },
  { id: "washing", label: "Washing", stage: "wash" },
  { id: "drying", label: "Drying", stage: "dry" },
  { id: "steam_ironing", label: "Steam Ironing", stage: "press" },
  { id: "quality_check", label: "Quality Check", stage: "press" },
  { id: "packed", label: "Packed", stage: "pack" },
  { id: "out_for_delivery", label: "Out for Delivery", stage: "pack" },
  { id: "delivered", label: "Delivered", stage: "pack" },
] as const;

export type OrderStatusId = (typeof ORDER_STATUSES)[number]["id"] | "cancelled";

export const ACTIVE_STATUSES: OrderStatusId[] = ORDER_STATUSES.filter((s) => s.id !== "delivered").map((s) => s.id);

/** Customers may cancel only before the pickup happens. */
export const CANCELLABLE_STATUSES: OrderStatusId[] = ["pickup_scheduled"];

export function statusLabel(id: string): string {
  if (id === "cancelled") return "Cancelled";
  return ORDER_STATUSES.find((s) => s.id === id)?.label ?? id;
}

export function statusIndex(id: string): number {
  return ORDER_STATUSES.findIndex((s) => s.id === id);
}
