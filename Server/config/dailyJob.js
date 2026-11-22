const supabase = require("./supabase");

/**
 * Executes a lightweight ping query against Supabase.
 * Keeps Supabase free-tier project active and performs database health monitoring.
 */
const performDailyDbPing = async () => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [Daily DB Job] Running scheduled database keep-alive check...`);

  if (!supabase) {
    console.warn(`[${timestamp}] [Daily DB Job] Supabase client is not configured (missing SUPABASE_URL or SUPABASE_KEY).`);
    return { success: false, reason: "Supabase client not configured" };
  }

  try {
    // Ping Supabase products table (limit 1 for zero overhead)
    const { data, error } = await supabase
      .from("products")
      .select("id")
      .limit(1);

    if (error) {
      console.error(`[${timestamp}] [Daily DB Job] Database ping query error:`, error.message);
      return { success: false, error: error.message };
    }

    console.log(`[${timestamp}] [Daily DB Job] Database ping successful. Records retrieved:`, data ? data.length : 0);
    return { success: true, timestamp };
  } catch (err) {
    console.error(`[${timestamp}] [Daily DB Job] Unexpected error during database ping:`, err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Initializes a native recurring interval (every 24 hours / 86,400,000 ms).
 * Also runs an initial ping 10 seconds after server startup.
 */
const initDailyDatabaseJob = () => {
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

  // Initial ping shortly after server startup
  setTimeout(() => {
    performDailyDbPing();
  }, 10000);

  // Set recurring daily interval
  const timer = setInterval(() => {
    performDailyDbPing();
  }, TWENTY_FOUR_HOURS);

  // Prevent timer from hanging process during shutdown
  if (timer && timer.unref) {
    timer.unref();
  }

  console.log("[Daily DB Job] Scheduled daily database keep-alive job initialized (running every 24h).");
};

module.exports = {
  performDailyDbPing,
  initDailyDatabaseJob,
};
