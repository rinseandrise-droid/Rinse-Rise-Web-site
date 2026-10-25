import { z } from "zod";
import { bookingWindowDays, pickupSlots } from "@/data/site";
import { isIndianMobile, normalizeIndianMobile } from "@/lib/phone";

export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => normalizeIndianMobile(v))
  .refine((v) => isIndianMobile(v), "Enter a valid 10-digit mobile number");

export const signupSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name").max(80),
    phone: phoneSchema,
    email: z.string().trim().email("Enter a valid email address"),
    password: z.string().min(8, "Use at least 8 characters").max(72),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export const addressSchema = z.object({
  label: z.enum(["Home", "Work", "Other"]),
  name: z.string().trim().min(2, "Enter a contact name").max(80),
  phone: phoneSchema,
  line1: z.string().trim().min(4, "Enter the house / building and street").max(200),
  area: z.string().trim().max(120).default(""),
  city: z.string().trim().min(2, "Enter the city").max(80),
  state: z.string().trim().min(2, "Enter the state").max(80),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a 6-digit PIN code"),
  landmark: z.string().trim().max(120).default(""),
  instructions: z.string().trim().max(300).default(""),
});

export type AddressInput = z.infer<typeof addressSchema>;

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(80),
  phone: phoneSchema,
});

/** Today's date in India (YYYY-MM-DD), independent of server timezone. */
export function todayInIndia(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

export function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export const orderRequestSchema = z.object({
  items: z
    .array(z.object({ itemId: z.string().min(1).max(200), quantity: z.number().positive().max(2000) }))
    .min(1, "Add at least one item")
    .max(100),
  addressId: z.string().uuid("Choose a pickup address"),
  pickupDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((d) => {
      const today = todayInIndia();
      return d >= today && d <= addDays(today, bookingWindowDays);
    }, "Choose a pickup date within the booking window"),
  pickupSlot: z.string().refine((s) => pickupSlots.some((p) => p.id === s), "Choose a pickup time"),
  notes: z.string().trim().max(500).default(""),
});

export type OrderRequest = z.infer<typeof orderRequestSchema>;
