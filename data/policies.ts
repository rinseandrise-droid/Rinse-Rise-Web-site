import { site } from "./site";

export interface Policy {
  slug: string;
  title: string;
  summary: string;
  sections: { heading: string; body: string }[];
}

/**
 * Policy text describes how this website and booking flow work.
 * TODO: have the business (and ideally a legal advisor) review before launch.
 */
export const policies: Policy[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    summary: "What we collect when you use this website, and why.",
    sections: [
      {
        heading: "Information we collect",
        body: "When you create an account we store your name, mobile number and email. When you book, we store your pickup addresses, selected items, pickup date and time window, and any notes you add.",
      },
      {
        heading: "How we use it",
        body: "Your details are used only to collect, process, deliver and support your laundry orders, and to contact you about them.",
      },
      {
        heading: "Security",
        body: "Passwords are handled by our authentication provider and are never stored by us in readable form. Your orders and addresses are visible only to your account and to the shop team.",
      },
      {
        heading: "Your choices",
        body: `You can update your profile and addresses from your account. To delete your account, contact us on ${site.phoneDisplay}.`,
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    summary: "The terms for using this website and booking a pickup.",
    sections: [
      {
        heading: "Bookings",
        body: "A booking is a request for pickup at the chosen address and time window. Prices shown come from our current rate card.",
      },
      {
        heading: "Pricing",
        body: "Per-piece services are charged by count. Laundry is charged by weight and confirmed after weighing. Items not on the rate card are quoted before processing.",
      },
      {
        heading: "Offers",
        body: "The first-order discount applies once per customer account, to the first order placed. Offers cannot be exchanged for cash.",
      },
    ],
  },
  {
    slug: "refund-cancellation",
    title: "Refund & Cancellation Policy",
    summary: "How cancellations work.",
    sections: [
      {
        heading: "Cancelling a booking",
        body: "You can cancel from your account while the order is at “Pickup Scheduled”. After pickup, contact us to discuss the order.",
      },
      {
        heading: "First-order offer",
        body: "If you cancel your first order before pickup, the first-order offer becomes available again for your next booking.",
      },
      {
        heading: "Concerns about an order",
        body: `If something isn't right with a finished order, contact us on ${site.phoneDisplay} as soon as possible so we can review it.`,
      },
    ],
  },
  {
    slug: "garment-care",
    title: "Garment Care Policy",
    summary: "How garments are inspected and handled.",
    sections: [
      {
        heading: "Inspection",
        body: "Garments are checked for fabric, care labels, stains and existing damage before processing.",
      },
      {
        heading: "Stains and wear",
        body: "Stains are treated according to the fabric. Some stains, colour bleeding or existing wear cannot be fully corrected without risking damage — we'll let you know.",
      },
      {
        heading: "High-value garments",
        body: "Please declare designer, bridal or high-value garments in your booking notes and at pickup so they can be handled separately.",
      },
    ],
  },
  {
    slug: "pickup-delivery",
    title: "Pickup & Delivery Policy",
    summary: "How pickups and deliveries are scheduled.",
    sections: [
      {
        heading: "Scheduling",
        body: "Choose a date and a time window when booking. Our team arrives within the chosen window.",
      },
      {
        heading: "Charges",
        body: `${site.promises[0]}, as stated on our invoices.`,
      },
      {
        heading: "Service area",
        body: "Pickup is available in the areas listed on our website. Contact us if you are just outside them.",
      },
    ],
  },
];

export function getPolicy(slug: string) {
  return policies.find((p) => p.slug === slug);
}
