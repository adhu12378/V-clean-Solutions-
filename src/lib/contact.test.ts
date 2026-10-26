import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { WHATSAPP_URL } from "./contact";

describe("WhatsApp contact", () => {
  it("sends enquiries to the requested company number", () => {
    assert.equal(new URL(WHATSAPP_URL).pathname, "/447554462594");
  });
  it("prepares the requested cleaning enquiry", () => {
    assert.equal(new URL(WHATSAPP_URL).searchParams.get("text"), "Hi VClean Solutions, I'd like to inquire about a cleaning service");
  });
});