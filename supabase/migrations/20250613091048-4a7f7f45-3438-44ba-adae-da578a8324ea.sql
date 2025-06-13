
-- Add tracking script related columns to companies table
ALTER TABLE companies ADD COLUMN IF NOT EXISTS script_installed BOOLEAN DEFAULT false;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS script_verification_status TEXT DEFAULT 'pending';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS last_tracking_event TIMESTAMP WITH TIME ZONE;

-- Create table for tracking script events
CREATE TABLE IF NOT EXISTS public.tracking_script_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    event_data JSONB NOT NULL,
    ip_hash TEXT,
    user_agent TEXT,
    referrer TEXT,
    page_url TEXT NOT NULL,
    device_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on tracking_script_events
ALTER TABLE public.tracking_script_events ENABLE ROW LEVEL SECURITY;

-- Policy for companies to view their own tracking events
CREATE POLICY "Companies can view their own tracking events" 
    ON public.tracking_script_events 
    FOR SELECT 
    USING (
        company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()
        )
    );

-- Policy for admins to view all tracking events
CREATE POLICY "Admins can view all tracking events" 
    ON public.tracking_script_events 
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create function to verify script installation
CREATE OR REPLACE FUNCTION public.verify_script_installation(company_tracking_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    company_record RECORD;
    has_events BOOLEAN := false;
BEGIN
    -- Find company by tracking_id
    SELECT * INTO company_record 
    FROM companies 
    WHERE tracking_id = company_tracking_id;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Check if there are any tracking events for this company
    SELECT EXISTS(
        SELECT 1 FROM tracking_script_events 
        WHERE company_id = company_record.id
        AND created_at > now() - interval '7 days'
    ) INTO has_events;
    
    -- Update script status
    UPDATE companies 
    SET 
        script_installed = has_events,
        script_verification_status = CASE 
            WHEN has_events THEN 'active'
            ELSE 'pending'
        END,
        last_tracking_event = CASE
            WHEN has_events THEN (
                SELECT MAX(created_at) 
                FROM tracking_script_events 
                WHERE company_id = company_record.id
            )
            ELSE last_tracking_event
        END
    WHERE id = company_record.id;
    
    RETURN has_events;
END;
$$;

-- Create function to handle incoming tracking data
CREATE OR REPLACE FUNCTION public.process_tracking_event(
    tracking_id_param TEXT,
    page_url_param TEXT,
    referrer_param TEXT DEFAULT NULL,
    user_agent_param TEXT DEFAULT NULL,
    ip_address_param INET DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    company_record RECORD;
    ip_hash_value TEXT;
    result JSONB;
BEGIN
    -- Find company by tracking_id
    SELECT * INTO company_record 
    FROM companies 
    WHERE tracking_id = tracking_id_param;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid tracking ID');
    END IF;
    
    -- Create IP hash for privacy
    IF ip_address_param IS NOT NULL THEN
        ip_hash_value := encode(digest(ip_address_param::text, 'sha256'), 'hex');
    END IF;
    
    -- Insert tracking event
    INSERT INTO tracking_script_events (
        company_id,
        event_data,
        ip_hash,
        user_agent,
        referrer,
        page_url
    ) VALUES (
        company_record.id,
        jsonb_build_object(
            'tracking_id', tracking_id_param,
            'timestamp', extract(epoch from now())
        ),
        ip_hash_value,
        user_agent_param,
        referrer_param,
        page_url_param
    );
    
    -- Update company tracking status
    UPDATE companies 
    SET 
        script_installed = true,
        script_verification_status = 'active',
        last_tracking_event = now(),
        views_count = views_count + 1
    WHERE id = company_record.id;
    
    RETURN jsonb_build_object('success', true, 'company_id', company_record.id);
END;
$$;
