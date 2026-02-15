import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lnhadqbxmhrzydvfsudh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuaGFkcWJ4bWhyenlkdmZzdWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMjc2MTcsImV4cCI6MjA4NjcwMzYxN30.RBRdPucTHLBsXLyjlkQeXrWhxxL-wm57vL0t4tJ4xG4';

export const supabase = createClient(supabaseUrl, supabaseKey);