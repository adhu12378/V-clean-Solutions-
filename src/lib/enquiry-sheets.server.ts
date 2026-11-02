import type { EnquiryInput } from "./enquiry-schema";

const trackerId = "1TIUk9Qmtxs4QHrrE24FWnoGOipLpXkRhxu_QQEzuzYs";

export async function recordEnquiryInSheets(reference: string, enquiry: EnquiryInput) {
  const key = process.env["GOOGLE_SHEETS_API_KEY"];
  const gatewayKey = process.env["LOVABLE_API_KEY"];
  if (!key || !gatewayKey) throw new Error("Google Sheets connection unavailable");
  const response = await fetch(`https://connector-gateway.lovable.dev/google_sheets/v4/spreadsheets/${trackerId}/values/Enquiries!A:N:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${gatewayKey}`, "X-Connection-Api-Key": key },
    body: JSON.stringify({ values: [[reference, new Date().toISOString(), enquiry.customer_name, enquiry.email, enquiry.phone, enquiry.postcode, enquiry.address, enquiry.service_type, enquiry.property_size_hours, enquiry.add_ons.join(", "), enquiry.preferred_date, enquiry.arrival_window, "new", ""]] }),
  });
  if (!response.ok) {
    const body = await response.text();
    console.error(`Google Sheets failed [${response.status}]: ${body}`);
    throw new Error(`Google Sheets failed [${response.status}]: ${body}`);
  }
}