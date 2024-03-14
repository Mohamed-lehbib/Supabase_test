import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_PUBLIC_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or public key is missing. Make sure you have set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_PUBLIC_KEY environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
