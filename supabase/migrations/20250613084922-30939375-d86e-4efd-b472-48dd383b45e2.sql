
-- Check if the user_role type exists and create it if it doesn't
DO $$ 
BEGIN
    -- Try to create the enum type
    CREATE TYPE user_role AS ENUM ('admin', 'company');
EXCEPTION
    WHEN duplicate_object THEN 
        -- Type already exists, do nothing
        NULL;
END $$;

-- Ensure the profiles table uses the correct type
DO $$
BEGIN
    -- Check if the column exists with wrong type and fix it
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'role' 
        AND data_type != 'USER-DEFINED'
    ) THEN
        ALTER TABLE profiles ALTER COLUMN role TYPE user_role USING role::text::user_role;
    END IF;
END $$;

-- Recreate the trigger function to ensure it works properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block user creation
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Drop and recreate the trigger to ensure it's working
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
