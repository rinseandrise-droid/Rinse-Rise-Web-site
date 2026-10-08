import { formatINR, type OrderTotals as Totals } from "@/lib/pricing";
import { fees } from "@/data/site";

export function OrderTotals({ totals }: { totals: Totals }) {
  return (
    <dl className="space-y-2 text-sm">
      <Row label="Subtotal" value={formatINR(totals.subtotal)} />
      {totals.discount > 0 && (
        <Row label={totals.discountLabel ?? "Discount"} value={`− ${formatINR(totals.discount)}`} accent />
      )}
      {totals.charges.map((c) => (
        <Row key={c.id} label={c.label} value={c.amount === 0 ? "Free" : formatINR(c.amount)} />
      ))}
      {fees.taxRate > 0 && <Row label={fees.taxLabel} value={formatINR(totals.tax)} />}
      <div className="flex items-center justify-between border-t border-line pt-3 font-display text-xl font-extrabold">
        <dt>Total</dt>
        <dd className="tabular-nums text-orange-dark">{formatINR(totals.total)}</dd>
      </div>
      {totals.hasWeightedItems && (
        <p className="pt-1 text-xs text-muted">Laundry by kg is confirmed after weighing at the studio.</p>
      )}
    </dl>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${accent ? "font-bold text-orange-dark" : ""}`}>
      <dt className="text-muted">{label}</dt>
      <dd className="tabular-nums font-semibold">{value}</dd>
    </div>
  );
}
