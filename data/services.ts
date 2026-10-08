import rateCard from "./rate-card.json";

/**
 * Service catalogue built from data/rate-card.json, which is generated from
 * "Rinse&Rise Laundryrite Rate Card.xlsx" by scripts/extract-rate-card.py.
 * Never edit names or rates here — change the spreadsheet and re-run the script.
 */

export type Unit = "piece" | "kg" | "sq";

export interface ServiceItem {
  id: string;
  serviceId: string;
  groupId: string;
  name: string;
  rate: number;
  unit: Unit;
  /** Rate exactly as written in the spreadsheet when it is not a plain number (e.g. "40/sq"). */
  rateText?: string;
}

export interface ServiceGroup {
  id: string;
  serviceId: string;
  /** Group heading exactly as written in the spreadsheet (e.g. "MEN"). */
  name: string;
  items: ServiceItem[];
}

export interface Service {
  id: string;
  name: string;
  tagline: string;
  description: string;
  careNote: string;
  groups: ServiceGroup[];
  items: ServiceItem[];
}

interface RawItem {
  name: string;
  rate: number;
  unit: string;
  rateText?: string;
}

interface RawGroup {
  name: string;
  items: RawItem[];
}

interface RawService {
  id: string;
  name: string;
  groups: RawGroup[];
}

/** Customer-facing copy per service. Prices and items always come from the rate card. */
const SERVICE_COPY: Record<string, Pick<Service, "tagline" | "description" | "careNote">> = {
  "steam-iron": {
    tagline: "Crisp, steam-pressed finishing",
    description:
      "Garments pressed with steam for a clean, crisp finish — from everyday shirts to heavy ethnic wear.",
    careNote: "Pressing temperature is chosen according to each garment's fabric.",
  },
  "dry-clean": {
    tagline: "Solvent care for delicate fabrics",
    description:
      "Dry cleaning for garments, household furnishings, bags, soft toys and accessories that should not be water-washed.",
    careNote: "Each item is checked for fabric and care labels before cleaning.",
  },
  laundry: {
    tagline: "Washed, dried and finished by weight",
    description: "Everyday laundry charged by weight — washed and steam ironed, or washed and folded.",
    careNote: "Drying method is selected according to fabric care requirements.",
  },
  "shoe-cleaning": {
    tagline: "Deep cleaning for every pair",
    description: "Cleaning for sports, canvas, leather and suede shoes, sandals, slippers and boots.",
    careNote: "Cleaning method is matched to the material of each pair.",
  },
};

function slug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildCatalogue(raw: RawService[]): Service[] {
  return raw.map((service) => {
    const groups: ServiceGroup[] = service.groups.map((group) => {
      const groupId = slug(group.name);
      const seen = new Map<string, number>();
      const items = group.items.map((item) => {
        const base = `${service.id}.${groupId}.${slug(item.name)}`;
        const count = (seen.get(base) ?? 0) + 1;
        seen.set(base, count);
        return {
          id: count === 1 ? base : `${base}-${count}`,
          serviceId: service.id,
          groupId,
          name: item.name,
          rate: item.rate,
          unit: item.unit as Unit,
          ...(item.rateText ? { rateText: item.rateText } : {}),
        };
      });
      return { id: groupId, serviceId: service.id, name: group.name, items };
    });
    const copy = SERVICE_COPY[service.id] ?? {
      tagline: service.name,
      description: service.name,
      careNote: "",
    };
    return {
      id: service.id,
      name: service.name,
      ...copy,
      groups,
      items: groups.flatMap((g) => g.items),
    };
  });
}

export const services: Service[] = buildCatalogue((rateCard as { services: RawService[] }).services);

export const allItems: ServiceItem[] = services.flatMap((s) => s.items);

const itemIndex = new Map(allItems.map((item) => [item.id, item]));
const serviceIndex = new Map(services.map((s) => [s.id, s]));

export function getItem(id: string): ServiceItem | undefined {
  return itemIndex.get(id);
}

export function getService(id: string): Service | undefined {
  return serviceIndex.get(id);
}

export function getGroup(serviceId: string, groupId: string): ServiceGroup | undefined {
  return getService(serviceId)?.groups.find((g) => g.id === groupId);
}

export function startingRate(items: ServiceItem[]): ServiceItem | undefined {
  return items.reduce<ServiceItem | undefined>(
    (min, item) => (!min || item.rate < min.rate ? item : min),
    undefined
  );
}

export const UNIT_LABEL: Record<Unit, string> = {
  piece: "piece",
  kg: "kg",
  sq: "sq",
};

/** "₹15 / piece", "₹80 / kg", "₹40 / sq" — keeps the spreadsheet's unit wording. */
export function formatRate(item: Pick<ServiceItem, "rate" | "unit">): string {
  return `₹${formatNumber(item.rate)} / ${UNIT_LABEL[item.unit]}`;
}

export function formatNumber(value: number): string {
  return Number.isInteger(value) ? value.toLocaleString("en-IN") : value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

/** Group names that appear across services (Men, Women, Kids…) for filters. */
export const groupFilters: { id: string; name: string }[] = Array.from(
  new Map(services.flatMap((s) => s.groups.map((g) => [g.id, { id: g.id, name: g.name }]))).values()
);
