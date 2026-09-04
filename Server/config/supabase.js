const { createClient } = require("@supabase/supabase-js");

const hasSupabaseConfig = Boolean(
  process.env.SUPABASE_URL && process.env.SUPABASE_KEY
);

if (!hasSupabaseConfig) {
  console.warn("SUPABASE_URL and SUPABASE_KEY are required for database features.");
}

const supabase = hasSupabaseConfig
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  : null;

module.exports = supabase;