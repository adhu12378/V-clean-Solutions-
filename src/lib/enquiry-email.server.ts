import type { EnquiryInput } from "./enquiry-schema";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export async function notifyNewEnquiry(reference: string, enquiry: EnquiryInput) {
  const { data: settings } = await supabaseAdmin.from("notification_settings").select("*").eq("id", true).maybeSingle();
  if (!settings?.enabled || !settings.sender_email) return { status: "not_configured", error: "" };
  const key = process.env["RESEND_API_KEY"];
  const gatewayKey = process.env["LOVABLE_API_KEY"];
  if (!key || !gatewayKey) return { status: "failed", error: "Resend connection unavailable" };
  const response = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
    method: "POST", headers: { Authorization: `Bearer ${gatewayKey}`, "X-Connection-Api-Key": key, "Content-Type": "application/json", "Idempotency-Key": `enquiry-${reference}` },
    body: JSON.stringify({ from: `VClean Solutions <${settings.sender_email}>`, to: [settings.recipient_email], subject: `New cleaning enquiry ${reference}`, text: `New enquiry: ${reference}\n\nCustomer: ${enquiry.customer_name}\nEmail: ${enquiry.email}\nPhone: ${enquiry.phone}\nPostcode: ${enquiry.postcode}\nAddress: ${enquiry.address}\nService: ${enquiry.service_type}\nHours: ${enquiry.property_size_hours}\nAdd-ons: ${enquiry.add_ons.join(", ") || "None"}\nDate: ${enquiry.preferred_date}\nArrival: ${enquiry.arrival_window}\n\nManage enquiries at your VClean website /admin.` }),
  });
  if (!response.ok) {
    const error = await response.text();
    console.error(`Resend failed [${response.status}]: ${error}`);
    return { status: "failed", error: `[${response.status}] ${error}`.slice(0, 2000) };
  }
  return { status: "sent", error: "" };
}