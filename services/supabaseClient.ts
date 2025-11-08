import { createClient } from '@supabase/supabase-js';

// --- SUPABASE SETUP INSTRUCTIONS (IMPORTANT!) ---
// Run the scripts below in your Supabase SQL Editor to configure the database correctly.

/*
-- =================================================================
--         SCRIPT 1: SUPER ADMIN MANAGEMENT (v6 - Definitive Fix)
-- =================================================================
-- Purpose: Fixes the "structure of query does not match" error by creating an RPC function
-- that explicitly casts data types to ensure they match the function's return signature.
-- When to run: If you encounter errors on the "Quản lý Admin" page.
-- =================================================================

CREATE OR REPLACE FUNCTION public.get_users_with_roles()
RETURNS TABLE(user_id UUID, email TEXT, role TEXT) AS $$
BEGIN
  IF (SELECT auth.jwt()->>'email') <> 'vpi.sonnt@pvn.vn' THEN
    RAISE EXCEPTION '403: Forbidden - Only the super admin can perform this action.';
  END IF;

  RETURN QUERY
  SELECT
    u.id as user_id,
    u.email::text,
    COALESCE(p.role, 'user')::text AS role
  FROM
    auth.users u
  LEFT JOIN
    public.profiles p ON u.id = p.id
  ORDER BY
    u.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP POLICY IF EXISTS "Super admins can update any profile." ON public.profiles;
CREATE POLICY "Super admins can update any profile."
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ((SELECT auth.jwt()->>'email') = 'vpi.sonnt@pvn.vn')
  WITH CHECK ((SELECT auth.jwt()->>'email') = 'vpi.sonnt@pvn.vn');

*/

/*
-- =================================================================
--         SCRIPT 2: DOCUMENT UPLOAD PERMISSIONS (RLS Policies)
-- =================================================================
-- Purpose: Fixes the "new row violates row-level security policy" error that occurs
-- when an admin tries to upload a file to the "Văn bản và Tài liệu" page.
-- When to run: Run this script ONCE to set up the necessary permissions.
-- =================================================================

-- 1. Enable Row Level Security on the 'documents' table.
-- This is a crucial security step that locks down the table by default.
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy to ALLOW ADMINS to UPLOAD (INSERT) new documents.
-- This policy checks if the user's role is 'admin' OR if they are the super admin.
DROP POLICY IF EXISTS "Admins can upload documents." ON public.documents;
CREATE POLICY "Admins can upload documents."
  ON public.documents FOR INSERT
  TO authenticated
  WITH CHECK (
    ( (select role from public.profiles where id = auth.uid()) = 'admin' )
    OR
    ( (select auth.jwt()->>'email') = 'vpi.sonnt@pvn.vn' )
  );

-- 3. Create a policy to ALLOW ALL AUTHENTICATED USERS to VIEW (SELECT) documents.
-- This ensures that any user who is logged in can see the list of available documents.
DROP POLICY IF EXISTS "Authenticated users can view documents." ON public.documents;
CREATE POLICY "Authenticated users can view documents."
  ON public.documents FOR SELECT
  TO authenticated
  USING (true);

*/

/*
-- =================================================================
--         SCRIPT 3: PROFILE ACCESS PERMISSIONS (RLS Policies)
-- =================================================================
-- Purpose: Fixes the root cause of the "violates row-level security" error
-- by ensuring users can read their own profile information. The 'documents' upload
-- policy (Script 2) needs this permission to check the user's role.
-- When to run: Run this script ONCE to fix the upload issue.
-- =================================================================

-- 1. Enable Row Level Security on the 'profiles' table.
-- This is a standard security measure. It might already be enabled.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy to ALLOW USERS to VIEW their OWN profile.
-- This is the crucial step. It allows the document upload policy to verify
-- a user's role without granting broad access to the entire profiles table.
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
CREATE POLICY "Users can view their own profile."
  ON public.profiles FOR SELECT
  TO authenticated
  USING ( auth.uid() = id );

*/

/*
-- =================================================================
--         SCRIPT 4: AUTO-CREATE USER PROFILE (Database Trigger)
-- =================================================================
-- Purpose: To permanently fix the root cause of RLS errors by automatically
-- creating a profile for every new user who signs up. This ensures that
-- RLS policies that check the 'profiles' table will always find a row.
-- When to run: Run this script ONCE. This is a permanent, one-time setup.
-- =================================================================

-- 1. Create a function that will be triggered on new user creation.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

-- 2. Create the trigger that calls the function after a new user is added to auth.users.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =================================================================
--         IMMEDIATE FIX FOR YOUR EXISTING ADMIN ACCOUNT
-- =================================================================
-- The trigger above only works for NEW users. To fix your current admin account,
-- you must manually create its profile.
--
-- REASON: The command `INSERT ... VALUES (auth.uid())` fails in the SQL Editor
-- because `auth.uid()` returns NULL when not called via an API request.
--
-- INSTRUCTIONS:
-- 1. Go to the "Authentication" -> "Users" page in your Supabase dashboard.
-- 2. Find your user (`vpi.sonnt@pvn.vn`) and click "Copy user ID".
-- 3. Paste the ID into the command below, replacing 'YOUR_USER_ID_HERE'.
-- 4. Run the updated command in the SQL Editor.
-- =================================================================

-- INSERT INTO public.profiles (id, role)
-- VALUES ('YOUR_USER_ID_HERE', 'admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

*/

/*
-- =================================================================
--         SCRIPT 5: ROBUST ADMIN CHECK FUNCTION (Definitive RLS Fix)
-- =================================================================
-- Purpose: To definitively solve the "violates row-level security policy" error by creating a
-- SECURITY DEFINER function. This function can safely check a user's role without being
-- blocked by nested RLS policies, which is the root cause of the persistent issue.
-- When to run: Run this script ONCE. This will replace the previous upload policy with a more robust version.
-- =================================================================

-- 1. Create a function that securely checks if the current user is an admin.
-- By using `SECURITY DEFINER`, this function runs with the permissions of the database owner,
-- allowing it to bypass RLS on the `profiles` table to reliably get the user's role.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. Re-create the document upload policy to use the new, reliable function.
-- This policy now calls `public.is_admin()` for the role check, which will always work correctly.
DROP POLICY IF EXISTS "Admins can upload documents." ON public.documents;
CREATE POLICY "Admins can upload documents."
  ON public.documents FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin()
    OR
    ( (select auth.jwt()->>'email') = 'vpi.sonnt@pvn.vn' )
  );

*/

/*
-- =================================================================
--         SCRIPT 6: STORAGE ACCESS POLICIES (Final Fix for Upload)
-- =================================================================
-- Purpose: To fix the "400 Bad Request" error during file upload by creating
-- the necessary security policies for Supabase Storage. Database RLS and Storage
-- Policies are separate systems. This script grants the correct permissions for the Storage system.
-- When to run: Run this script ONCE. This is the final step to enable uploads.
-- =================================================================

-- === POLICIES FOR 'documents' BUCKET ===

-- 1. Policy to allow authenticated users to UPLOAD files.
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;
CREATE POLICY "Authenticated users can upload documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK ( bucket_id = 'documents' );

-- 2. Policy to allow anyone to DOWNLOAD/VIEW files (since the bucket is public).
DROP POLICY IF EXISTS "Anyone can view documents" ON storage.objects;
CREATE POLICY "Anyone can view documents"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'documents' );


-- === POLICIES FOR 'attachments' BUCKET (for Problem/Statement form) ===

-- 3. Policy to allow authenticated users to UPLOAD attachments.
DROP POLICY IF EXISTS "Authenticated users can upload attachments" ON storage.objects;
CREATE POLICY "Authenticated users can upload attachments"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK ( bucket_id = 'attachments' );

-- 4. Policy to allow anyone to DOWNLOAD/VIEW attachments.
DROP POLICY IF EXISTS "Anyone can view attachments" ON storage.objects;
CREATE POLICY "Anyone can view attachments"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'attachments' );

*/


const supabaseUrl = 'https://phnsxouatbnyczmcmqfw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBobnN4b3VhdGJueWN6bWNtcWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NzIyODgsImV4cCI6MjA3ODE0ODI4OH0.ouDCgJRE5JyTRTIxVCx60rsmmCCowwuYyq1osogpSD0';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);