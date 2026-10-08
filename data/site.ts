/**
 * Business configuration. Values here come from the shop's own invoice settings
 * (laundry-billing). Anything marked TODO must be supplied by the business before
 * it is shown on the site — empty values are hidden by the UI.
 */

export const site = {
  name: "Rinse & Rise Laundryrite",
  shortName: "Rinse & Rise",
  tagline: "Rinse · Rise · Repeat",
  description:
    "Professional laundry care in Electronic City, Bangalore — steam ironing, dry cleaning, laundry by weight and shoe cleaning, with pickup and delivery.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  phone: "9591506548",
  phoneDisplay: "+91 95915 06548",
  whatsapp: "919591506548",
  // TODO: add the business email address when available.
  email: "",
  hours: "9 AM – 9 PM",
  hoursSchema: "Mo-Su 09:00-21:00",
  address: {
    line1: "Shop No 1, Site No 211, 15th Cross, 4th Main",
    area: "Ananth Nagar Phase 1, Electronic City",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560100",
    country: "IN",
  },
  googleReviewUrl: "https://g.page/r/CaSto0sK11yGEAE/review",
  // TODO: add social profile URLs when available.
  social: [] as { label: string; href: string }[],
  /** Service promises printed on the shop's own invoices. */
  promises: ["Free Pickup & Delivery", "Express 24-Hr Delivery"],
} as const;

export const firstOrderOffer = {
  code: "FIRST25",
  percent: 25,
  headline: "25% OFF your first order",
} as const;

/** Configurable charges. The shop's invoices state free pickup & delivery. */
export const fees = {
  pickup: 0,
  delivery: 0,
  /** Tax rate as a fraction (0.18 = 18%). Not applied until the business confirms GST treatment. */
  taxRate: 0,
  taxLabel: "GST",
} as const;

export interface PickupSlot {
  id: string;
  label: string;
  start: string;
  end: string;
}

/** Pickup windows within business hours. Adjust here (or later from an admin table). */
export const pickupSlots: PickupSlot[] = [
  { id: "morning", label: "Morning", start: "09:00", end: "12:00" },
  { id: "afternoon", label: "Afternoon", start: "12:00", end: "15:00" },
  { id: "evening", label: "Evening", start: "15:00", end: "18:00" },
  { id: "late", label: "Late evening", start: "18:00", end: "21:00" },
];

/** How many days ahead customers can book a pickup. */
export const bookingWindowDays = 7;

export interface ServiceArea {
  name: string;
  city: string;
  pincodes: string[];
}

/** Areas served for pickup. TODO: confirm the full list of PIN codes with the shop. */
export const serviceAreas: ServiceArea[] = [
  { name: "Electronic City", city: "Bangalore", pincodes: ["560100"] },
];

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export function whatsappLink(message = "Hi Rinse & Rise, I'd like to book a laundry pickup.") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function fullAddress() {
  const a = site.address;
  return `${a.line1}, ${a.area}, ${a.city} ${a.pincode}`;
}
