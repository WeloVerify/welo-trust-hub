
-- Add missing columns to companies table for better analytics
DO $$
BEGIN
    -- Add plan_type if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'companies' AND column_name = 'plan_type'
    ) THEN
        ALTER TABLE companies ADD COLUMN plan_type TEXT DEFAULT 'starter';
    END IF;
    
    -- Add views_count for analytics
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'companies' AND column_name = 'views_count'
    ) THEN
        ALTER TABLE companies ADD COLUMN views_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Create admin_settings table for admin configurations
CREATE TABLE IF NOT EXISTS public.admin_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on admin_settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access only
CREATE POLICY "Only admins can access admin settings" 
    ON public.admin_settings 
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create function to update company views count
CREATE OR REPLACE FUNCTION public.update_company_views()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update views count when a new tracking event is inserted
    UPDATE companies 
    SET views_count = views_count + 1,
        updated_at = now()
    WHERE id = NEW.company_id;
    
    RETURN NEW;
END;
$$;

-- Create trigger to automatically update views count
DROP TRIGGER IF EXISTS update_company_views_trigger ON tracking_events;
CREATE TRIGGER update_company_views_trigger
    AFTER INSERT ON tracking_events
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_company_views();
