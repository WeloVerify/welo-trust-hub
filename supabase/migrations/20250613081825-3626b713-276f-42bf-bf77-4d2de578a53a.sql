
-- Create enum types
CREATE TYPE public.company_status AS ENUM ('pending', 'under_review', 'approved', 'rejected');
CREATE TYPE public.plan_type AS ENUM ('starter', 'growth', 'pro', 'business', 'enterprise');
CREATE TYPE public.user_role AS ENUM ('admin', 'company');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'company',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  country TEXT NOT NULL,
  date_of_incorporation DATE,
  description TEXT,
  terms_url TEXT,
  privacy_url TEXT,
  status company_status NOT NULL DEFAULT 'pending',
  tracking_id TEXT UNIQUE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create company_branding table
CREATE TABLE public.company_branding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies ON DELETE CASCADE NOT NULL,
  logo_url TEXT,
  cover_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#3b82f6',
  display_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create company_documents table
CREATE TABLE public.company_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plans table
CREATE TABLE public.plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  plan_type plan_type NOT NULL,
  view_limit INTEGER NOT NULL,
  price_eur DECIMAL(10,2) NOT NULL,
  features JSONB,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create company_subscriptions table
CREATE TABLE public.company_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.plans ON DELETE RESTRICT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ends_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tracking_events table for real-time data
CREATE TABLE public.tracking_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL, -- 'view', 'click', 'impression'
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  country TEXT,
  device_type TEXT,
  browser TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_notifications table
CREATE TABLE public.admin_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies ON DELETE CASCADE NOT NULL,
  admin_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default plans
INSERT INTO public.plans (name, plan_type, view_limit, price_eur, features) VALUES
('Starter', 'starter', 5000, 19.00, '["Basic analytics", "Email support"]'),
('Growth', 'growth', 10000, 35.00, '["Advanced analytics", "Priority support", "Custom branding"]'),
('Pro', 'pro', 25000, 69.00, '["Real-time analytics", "API access", "Custom domains"]'),
('Business', 'business', 50000, 139.00, '["White-label solution", "Dedicated support", "Advanced integrations"]'),
('Enterprise', 'enterprise', 100000, 279.00, '["Unlimited features", "24/7 support", "Custom development"]');

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for companies
CREATE POLICY "Companies can view own data" ON public.companies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Companies can update own data" ON public.companies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Companies can insert own data" ON public.companies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all companies" ON public.companies
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for company_branding
CREATE POLICY "Companies can manage own branding" ON public.company_branding
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.companies 
      WHERE companies.id = company_branding.company_id 
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all branding" ON public.company_branding
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for company_documents
CREATE POLICY "Companies can manage own documents" ON public.company_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.companies 
      WHERE companies.id = company_documents.company_id 
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all documents" ON public.company_documents
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for plans (public read)
CREATE POLICY "Everyone can view plans" ON public.plans
  FOR SELECT USING (active = true);

-- RLS Policies for company_subscriptions
CREATE POLICY "Companies can view own subscriptions" ON public.company_subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.companies 
      WHERE companies.id = company_subscriptions.company_id 
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all subscriptions" ON public.company_subscriptions
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for tracking_events
CREATE POLICY "Companies can view own tracking" ON public.tracking_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.companies 
      WHERE companies.id = tracking_events.company_id 
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Tracking events can be inserted" ON public.tracking_events
  FOR INSERT WITH CHECK (true); -- Allow public insert for tracking script

CREATE POLICY "Admins can view all tracking" ON public.tracking_events
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for admin_notifications
CREATE POLICY "Admins can manage notifications" ON public.admin_notifications
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Companies can view own notifications" ON public.admin_notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.companies 
      WHERE companies.id = admin_notifications.company_id 
      AND companies.user_id = auth.uid()
    )
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id, 
    NEW.email,
    CASE 
      WHEN NEW.email = 'admin@welo.com' THEN 'admin'::user_role
      ELSE 'company'::user_role
    END
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to generate tracking ID
CREATE OR REPLACE FUNCTION public.generate_tracking_id()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.tracking_id IS NULL THEN
    NEW.tracking_id := 'welo_' || substr(encode(gen_random_bytes(12), 'base64'), 1, 16);
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to auto-generate tracking ID
CREATE TRIGGER generate_company_tracking_id
  BEFORE INSERT ON public.companies
  FOR EACH ROW EXECUTE PROCEDURE public.generate_tracking_id();

-- Enable realtime for tracking events
ALTER TABLE public.tracking_events REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.tracking_events;

-- Enable realtime for companies (for admin notifications)
ALTER TABLE public.companies REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.companies;

-- Enable realtime for admin notifications
ALTER TABLE public.admin_notifications REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.admin_notifications;
