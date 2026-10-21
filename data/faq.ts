import { firstOrderOffer, site } from "./site";

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Answers describe how this website and the shop's published promises work.
 * TODO: have the shop review policy answers (turnaround, stains, valuables) before launch.
 */
export const faqs: FaqItem[] = [
  {
    q: "How does pickup work?",
    a: "Create an account, choose your items, pick a saved address, a date and a pickup window, then confirm. Our team collects the garments from your door during that window.",
  },
  {
    q: "How long does laundry take?",
    a: `Turnaround depends on the service and the garments. Express 24-hour delivery is available — call or WhatsApp us on ${site.phoneDisplay} to confirm timing for your order.`,
  },
  {
    q: "What services are available?",
    a: "Steam ironing, dry cleaning, laundry by weight (wash & steam iron or wash & fold) and shoe cleaning. Every item and rate is listed on the Pricing page.",
  },
  {
    q: "What is dry cleaning?",
    a: "Dry cleaning cleans fabric with a solvent instead of water. It suits delicate, structured or embellished garments — like coats, silk, heavy ethnic wear and lehengas — that may shrink, fade or lose shape in water.",
  },
  {
    q: "How are clothes dried?",
    a: "Only where the fabric allows it. The drying method is selected according to each garment's care requirements.",
  },
  {
    q: "How are delicate clothes handled?",
    a: "Delicate garments are checked for fabric and care labels first, and are routed to the gentlest suitable process — often dry cleaning.",
  },
  {
    q: "How does pricing work?",
    a: "Steam ironing, dry cleaning and shoe cleaning are priced per piece. Laundry is priced per kg, and the final amount is confirmed after weighing. Carpets are priced per sq as listed on the rate card.",
  },
  {
    q: "Can I schedule a pickup?",
    a: "Yes. Choose a date and a pickup window while booking. You can book a few days in advance.",
  },
  {
    q: "Can I track my order?",
    a: "Yes. Your account shows each order's progress — from pickup scheduled through washing, ironing, quality check, packing and delivery.",
  },
  {
    q: "How does the first-order discount work?",
    a: `New customers get ${firstOrderOffer.percent}% off their first order. It is attached to your account when you sign up and applied automatically at checkout — once per customer.`,
  },
  {
    q: "Can I cancel an order?",
    a: "You can cancel from your account while the order is still at “Pickup Scheduled”. After pickup, please call or WhatsApp us.",
  },
  {
    q: "What happens if a garment has a stain?",
    a: "Point out stains when handing over your garments. Stains are treated according to the fabric, but some stains cannot be fully removed without damaging the garment — we'll let you know if that's the case.",
  },
  {
    q: "How should I hand over expensive garments?",
    a: "Mention designer, bridal or high-value garments in your booking notes and at pickup so they can be inspected and handled separately.",
  },
  {
    q: "How are clothes packed?",
    a: "Garments are folded or hung after finishing and packed neatly for delivery.",
  },
];
