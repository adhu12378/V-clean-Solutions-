REVOKE ALL ON public.customer_enquiries FROM anon, authenticated;
GRANT INSERT (customer_name,email,phone,postcode,address,service_type,property_size_hours,add_ons,preferred_date,arrival_window) ON public.customer_enquiries TO anon, authenticated;
GRANT ALL ON public.customer_enquiries TO service_role;