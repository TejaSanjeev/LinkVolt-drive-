import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Fix for ES Modules: Resolve the path to .env explicitly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Load the .env file immediately
dotenv.config({ path: path.resolve(__dirname, '.env') });

// 3. Get keys
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// 4. Debugging (Optional: Remove later if you want)
if (!supabaseUrl || !supabaseKey) {
    console.error(" ERROR: Supabase keys are missing!");
    console.error("   -> Check your .env file in the 'server' folder.");
    console.error("   -> Ensure keys are named SUPABASE_URL and SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseKey);