import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { adminUpdateSchema, notificationSchema } from "./admin-schema";

export const listAdminEnquiries = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ page: z.number().int().min(0), search: z.string().max(100), status: z.string().max(20) }).parse(input))
  .handler(async ({ context, data }) => {
    const { data: allowed } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!allowed) throw new Error("Administrator access required");
    let query = context.supabase.from("customer_enquiries").select("*", { count: "exact" }).order("created_at", { ascending: false });
    if (data.status) query = query.eq("status", data.status);
    if (data.search) {
      const term = data.search.replace(/[^a-zA-Z0-9 @.\-]/g, "");
      query = query.or(`customer_name.ilike.%${term}%,enquiry_id.ilike.%${term}%,email.ilike.%${term}%`);
    }
    const { data: rows, count, error } = await query.range(data.page * 25, data.page * 25 + 24);
    if (error) throw new Error("Could not load enquiries");
    const { data: profile } = await context.supabase.from("profiles").select("*").eq("id", context.userId).single();
    const { data: settings } = await context.supabase.from("notification_settings").select("*").eq("id", true).maybeSingle();
    return { rows: rows ?? [], count: count ?? 0, profile, settings };
  });

export const updateAdminEnquiry = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => adminUpdateSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { data: allowed } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!allowed) throw new Error("Administrator access required");
    const { id, ...changes } = data;
    const { data: row, error } = await context.supabase.from("customer_enquiries").update(changes).eq("id", id).select("id,status").single();
    if (error || !row) throw new Error("Could not save enquiry");
    return row;
  });

export const saveAdminSettings = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ display_name: z.string().trim().max(100), notifications: notificationSchema }).parse(input))
  .handler(async ({ context, data }) => {
    const { data: allowed } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!allowed) throw new Error("Administrator access required");
    const { error: profileError } = await context.supabase.from("profiles").update({ display_name: data.display_name }).eq("id", context.userId);
    const { error } = await context.supabase.from("notification_settings").upsert({ id: true, ...data.notifications });
    if (error || profileError) throw new Error("Could not save settings");
    return { saved: true };
  });