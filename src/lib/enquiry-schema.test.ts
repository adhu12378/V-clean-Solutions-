import { describe, expect, it } from "bun:test";
import { enquirySchema } from "./enquiry-schema";

const enquiry = {
  customer_name: "Test Customer", email: "test@example.com", phone: "075554462594",
  postcode: "lu1 2ab", address: "1 Test Street", service_type: "Residential Cleaning",
  property_size_hours: 3, add_ons: ["Oven Deep Scrub"], preferred_date: "2026-11-10",
  arrival_window: "9:00 AM – 11:00 AM",
};

describe("account-free enquiry intake", () => {
  it("accepts customer cleaning requirements without an account", () => {
    const result = enquirySchema.parse(enquiry);
    expect(result.customer_name).toBe("Test Customer");
    expect(result.property_size_hours).toBe(3);
    expect(result.add_ons).toEqual(["Oven Deep Scrub"]);
    expect(result.postcode).toBe("LU1 2AB");
  });
  it("does not let public submissions set management status", () => {
    expect(enquirySchema.safeParse({ ...enquiry, status: "booked" }).success).toBe(false);
  });
  it("rejects missing customer contact information", () => {
    expect(enquirySchema.safeParse({ ...enquiry, email: "" }).success).toBe(false);
  });
});