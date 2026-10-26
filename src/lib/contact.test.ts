import { describe, expect, test } from "bun:test";
import { WHATSAPP_URL } from "./contact";

describe("WhatsApp contact", () => {
  test("sends enquiries to the requested company number", () => {
    expect(new URL(WHATSAPP_URL).pathname).toBe("/447554462594");
  });
  test("prepares the requested cleaning enquiry", () => {
    expect(new URL(WHATSAPP_URL).searchParams.get("text")).toBe("Hi VClean Solutions, I'd like to inquire about a cleaning service");
  });
});