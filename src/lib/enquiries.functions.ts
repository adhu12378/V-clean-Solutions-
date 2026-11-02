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
    return { reference };
  });