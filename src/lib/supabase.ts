import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ipvqxuwxaengsppwkpah.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwdnF4dXd4YWVuZ3NwcHdrcGFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNjE4NDQsImV4cCI6MjA5NjYzNzg0NH0.uU1A1hSTuXSJxfiDguVOwgQotdZKHS8gqc8GNCiBkq8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Country = {
  id: string;
  name: string;
  slug: string;
  flag: string;
  description: string | null;
  price_nuvisa_fee: number;
  price_embassy_fee: number;
  max_travellers: number;
  visa_types: string;
  stay_duration: string;
  term_type: string;
  entry_type: string;
  is_active: boolean;
  popular: boolean;
  image_url: string | null;
  created_at: string;
};

export type CouponCode = {
  id: string;
  code: string;
  discount_percent: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
};

export type Application = {
  id: string;
  country_name: string | null;
  travellers: number;
  start_date: string | null;
  end_date: string | null;
  total_fee: number | null;
  payment_method: string | null;
  payment_status: string;
  coupon_code: string | null;
  discount_applied: number;
  applicant_name: string | null;
  applicant_email: string | null;
  applicant_phone: string | null;
  status: string;
  created_at: string;
};

export type Payment = {
  id: string;
  application_id: string | null;
  amount: number;
  method: string;
  status: string;
  stripe_payment_id: string | null;
  created_at: string;
};
