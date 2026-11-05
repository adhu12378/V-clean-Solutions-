import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { adminUpdateSchema, notificationSchema } from "./admin-schema";
describe("admin management rules", () => {
  it("accepts a booked enquiry status", () => {
    assert.equal(adminUpdateSchema.parse({ id:"00000000-0000-4000-8000-000000000001", status:"booked",notes:"",preferred_date:"2026-11-10",arrival_window:"9:00 AM – 11:00 AM" }).status,"booked");
  });
  it("rejects unsupported enquiry statuses", () => {
    assert.equal(adminUpdateSchema.safeParse({ id:"00000000-0000-4000-8000-000000000001", status:"approved",notes:"",preferred_date:"2026-11-10",arrival_window:"Morning" }).success,false);
  });
  it("cannot enable notifications without a sender", () => {
    assert.equal(notificationSchema.safeParse({ enabled:true,sender_email:"",recipient_email:"advaithsunil2001@gmail.com" }).success,false);
  });
});