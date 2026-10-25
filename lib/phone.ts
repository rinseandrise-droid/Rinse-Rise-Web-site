/** Shared Indian mobile helpers used by forms and tests. */

export function normalizeIndianMobile(value: string): string {
  return value.trim().replace(/[\s-]/g, "").replace(/^\+?91/, "");
}

export function isIndianMobile(value: string): boolean {
  return /^[6-9]\d{9}$/.test(normalizeIndianMobile(value));
}
