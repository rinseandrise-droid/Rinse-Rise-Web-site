"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AddToOrder } from "@/components/catalog/AddToOrder";
import {
  formatRate,
  groupFilters,
  services,
  type Service,
  type ServiceItem,
} from "@/data/services";

export function CatalogBrowser({
  initialServiceId,
  variant = "page",
}: {
  initialServiceId?: string;
  variant?: "page" | "pricing";
}) {
  const [query, setQuery] = useState("");
  const [serviceId, setServiceId] = useState(initialServiceId ?? "all");
  const [groupId, setGroupId] = useState("all");
  const [sort, setSort] = useState<"name" | "price-asc" | "price-desc">("name");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items: ServiceItem[] = [];
    const source: Service[] = serviceId === "all" ? services : services.filter((s) => s.id === serviceId);
    for (const s of source) {
      for (const g of s.groups) {
        if (groupId !== "all" && g.id !== groupId) continue;
        items.push(...g.items);
      }
    }
    if (q) items = items.filter((i) => i.name.toLowerCase().includes(q) || i.serviceId.includes(q));
    items = [...items].sort((a, b) => {
      if (sort === "price-asc") return a.rate - b.rate;
      if (sort === "price-desc") return b.rate - a.rate;
      return a.name.localeCompare(b.name);
    });
    return items;
  }, [query, serviceId, groupId, sort]);

  return (
    <div>
      <div className="neo p-4 sm:p-5">
        <label className="relative block">
          <span className="sr-only">Search items</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            className="input pl-11"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for shirts, sarees, blankets…"
          />
        </label>
        <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterChip label="All services" active={serviceId === "all"} onClick={() => setServiceId("all")} />
          {services.map((s) => (
            <FilterChip key={s.id} label={s.name} active={serviceId === s.id} onClick={() => setServiceId(s.id)} />
          ))}
        </div>
        <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterChip label="All groups" active={groupId === "all"} onClick={() => setGroupId("all")} />
          {groupFilters.map((g) => (
            <FilterChip key={g.id} label={g.name} active={groupId === g.id} onClick={() => setGroupId(g.id)} />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="font-semibold text-muted">{rows.length} items</p>
          <label className="flex min-w-0 items-center gap-2 font-semibold">
            Sort
            <select className="input min-h-10 min-w-0 py-1 text-sm" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
              <option value="name">Name</option>
              <option value="price-asc">Price · low to high</option>
              <option value="price-desc">Price · high to low</option>
            </select>
          </label>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="mt-8 text-center text-muted">No items match that search. Try another name or category.</p>
      ) : variant === "pricing" ? (
        <DesktopTable items={rows} />
      ) : (
        <ItemCards items={rows} />
      )}
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" className="chip shrink-0" aria-pressed={active} onClick={onClick}>
      {label}
    </button>
  );
}

function ItemCards({ items }: { items: ServiceItem[] }) {
  return (
    <ul className="mt-6 grid gap-3 lg:grid-cols-2">
      {items.map((item) => (
        <li key={item.id} className="neo-sm flex flex-col gap-3 p-4 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between">
          <div className="min-w-0">
            <p className="font-bold">{item.name}</p>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              {labelFor(item)} · {formatRate(item)}
            </p>
          </div>
          <AddToOrder item={item} className="w-full min-[480px]:w-auto" />
        </li>
      ))}
    </ul>
  );
}

function DesktopTable({ items }: { items: ServiceItem[] }) {
  return (
    <>
      <div className="mt-6 hidden overflow-x-auto rounded-[24px] border border-line lg:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-5 py-3 font-bold">Item</th>
              <th className="px-5 py-3 font-bold">Service</th>
              <th className="px-5 py-3 font-bold">Group</th>
              <th className="px-5 py-3 font-bold">Rate</th>
              <th className="px-5 py-3 font-bold"><span className="sr-only">Add</span></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-line bg-white">
                <td className="px-5 py-3 font-semibold">{item.name}</td>
                <td className="px-5 py-3 text-muted">{serviceName(item.serviceId)}</td>
                <td className="px-5 py-3 text-muted">{groupName(item)}</td>
                <td className="px-5 py-3 font-bold tabular-nums">{formatRate(item)}</td>
                <td className="px-5 py-3 text-right">
                  <AddToOrder item={item} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="lg:hidden">
        <ItemCards items={items} />
      </div>
    </>
  );
}

function serviceName(id: string) {
  return services.find((s) => s.id === id)?.name ?? id;
}

function groupName(item: ServiceItem) {
  return services.find((s) => s.id === item.serviceId)?.groups.find((g) => g.id === item.groupId)?.name ?? item.groupId;
}

function labelFor(item: ServiceItem) {
  return `${serviceName(item.serviceId)} · ${groupName(item)}`;
}
