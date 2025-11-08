
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://phnsxouatbnyczmcmqfw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBobnN4b3VhdGJueWN6bWNtcWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NzIyODgsImV4cCI6MjA3ODE0ODI4OH0.ouDCgJRE5JyTRTIxVCx60rsmmCCowwuYyq1osogpSD0';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
