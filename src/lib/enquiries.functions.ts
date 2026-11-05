import { createServerFn } from "@tanstack/react-start";
import { enquirySchema } from "./enquiry-schema";

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => enquirySchema.parse(input))
  .handler(async ({ data }) => {
    // Public write-only intake: privileged access is limited to this validated
    // fixed-purpose RPC. Never return customer records to public callers.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: reference, error } = await supabaseAdmin.rpc("submit_cleaning_enquiry", { payload: data });
    if (error || !reference) {
      console.error("Enquiry storage failed", error?.code);
      throw new Error("We couldn’t save your enquiry. Please try again or contact us on WhatsApp.");
    }
    let trackerRecorded = false;
    try {
      const { recordEnquiryInSheets } = await import("./enquiry-sheets.server");
      await recordEnquiryInSheets(reference, data);
      trackerRecorded = true;
    } catch (error) {
      console.error("Enquiry saved, tracker copy failed", error instanceof Error ? error.message : "Unknown failure");
    }
    await supabaseAdmin.from("customer_enquiries").update({ sheets_sync_status: trackerRecorded ? "synced" : "failed" }).eq("enquiry_id", reference);
    try {
      const { notifyNewEnquiry } = await import("./enquiry-email.server");
      const notice = await notifyNewEnquiry(reference, data);
      await supabaseAdmin.from("customer_enquiries").update({ notification_status: notice.status, notification_error: notice.error }).eq("enquiry_id", reference);
    } catch {
      await supabaseAdmin.from("customer_enquiries").update({ notification_status: "failed", notification_error: "Notification service unavailable" }).eq("enquiry_id", reference);
    }
    return { reference };
  });