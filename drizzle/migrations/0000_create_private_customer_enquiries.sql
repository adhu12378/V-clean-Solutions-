CREATE SEQUENCE public.enquiry_reference_seq START 1001;
CREATE TABLE public.customer_enquiries (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 enquiry_id text NOT NULL UNIQUE DEFAULT ('VC-' || nextval('public.enquiry_reference_seq')::text),
 created_at timestamptz NOT NULL DEFAULT now(),
 customer_name text NOT NULL CHECK (char_length(customer_name) BETWEEN 1 AND 150),
 email text NOT NULL CHECK (char_length(email) <= 254),
 phone text NOT NULL CHECK (char_length(phone) BETWEEN 5 AND 40),
 postcode text NOT NULL CHECK (char_length(postcode) BETWEEN 2 AND 12),
 address text NOT NULL CHECK (char_length(address) BETWEEN 1 AND 500),
 service_type text NOT NULL,
 property_size_hours integer NOT NULL CHECK (property_size_hours IN (2,3,4,6)),
 add_ons text[] NOT NULL DEFAULT '{}',
 preferred_date date NOT NULL,
 arrival_window text NOT NULL,
 status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','quoted','booked','completed','cancelled')),
 notes text NOT NULL DEFAULT '' CHECK (char_length(notes) <= 5000)
);
GRANT INSERT (customer_name,email,phone,postcode,address,service_type,property_size_hours,add_ons,preferred_date,arrival_window) ON public.customer_enquiries TO anon, authenticated;
GRANT ALL ON public.customer_enquiries TO service_role;
GRANT USAGE ON SEQUENCE public.enquiry_reference_seq TO anon, authenticated, service_role;
ALTER TABLE public.customer_enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors submit new enquiries only" ON public.customer_enquiries FOR INSERT TO anon, authenticated WITH CHECK (status = 'new' AND notes = '');
CREATE INDEX customer_enquiries_created_at_idx ON public.customer_enquiries (created_at DESC);
CREATE OR REPLACE FUNCTION public.submit_cleaning_enquiry(payload jsonb) RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE ref text;
BEGIN
 INSERT INTO public.customer_enquiries(customer_name,email,phone,postcode,address,service_type,property_size_hours,add_ons,preferred_date,arrival_window)
 VALUES (payload->>'customer_name',payload->>'email',payload->>'phone',payload->>'postcode',payload->>'address',payload->>'service_type',(payload->>'property_size_hours')::integer,ARRAY(SELECT jsonb_array_elements_text(COALESCE(payload->'add_ons','[]'::jsonb))),(payload->>'preferred_date')::date,payload->>'arrival_window') RETURNING enquiry_id INTO ref;
 RETURN ref;
END; $$;
REVOKE ALL ON FUNCTION public.submit_cleaning_enquiry(jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_cleaning_enquiry(jsonb) TO service_role;