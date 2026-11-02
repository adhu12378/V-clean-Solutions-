import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
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
    assert.equal(result.customer_name, "Test Customer");
    assert.equal(result.property_size_hours, 3);
    assert.deepEqual(result.add_ons, ["Oven Deep Scrub"]);
    assert.equal(result.postcode, "LU1 2AB");
  });
  it("does not let public submissions set management status", () => {
    assert.equal(enquirySchema.safeParse({ ...enquiry, status: "booked" }).success, false);
  });
  it("rejects missing customer contact information", () => {
    assert.equal(enquirySchema.safeParse({ ...enquiry, email: "" }).success, false);
  });
});