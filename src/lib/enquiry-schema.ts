import { z } from "zod";

export const enquirySchema = z.object({
  customer_name: z.string().trim().min(1).max(150),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(5).max(40),
  postcode: z.string().trim().min(2).max(12).transform((value) => value.toUpperCase()),
  address: z.string().trim().min(1).max(500),
  service_type: z.enum(["Residential Cleaning", "Office & Commercial", "Deep Cleaning", "Move-In / Move-Out", "Carpet & Upholstery", "Window Cleaning", "Post-Construction", "Disinfection & Turnover"]),
  property_size_hours: z.union([z.literal(2), z.literal(3), z.literal(4), z.literal(6)]),
  add_ons: z.array(z.enum(["Oven Deep Scrub", "Fridge & Freezer", "Interior Windows", "Carpet Steam", "Balcony", "Hypoallergenic Eco Kit"])).max(6),
  preferred_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  arrival_window: z.enum(["9:00 AM – 11:00 AM", "11:00 AM – 1:00 PM", "1:00 PM – 3:00 PM", "3:00 PM – 5:00 PM"]),
}).strict();

export type EnquiryInput = z.infer<typeof enquirySchema>;