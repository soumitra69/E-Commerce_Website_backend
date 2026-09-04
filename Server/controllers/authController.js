const supabase = require("../config/supabase");

const requireSupabase = (res) => {
  if (!supabase) {
    res.status(503).json({ message: "Supabase environment variables are not configured" });
    return false;
  }

  return true;
};

const getAuthErrorMessage = (error, fallback) => {
  const message = error.message?.toLowerCase() || "";

  if (message.includes("rate limit") || message.includes("email rate limit")) {
    return "Email limit reached. Please wait a few minutes before trying again, or check your inbox for the existing confirmation email.";
  }

  return error.message || fallback;
};

// ==========================
// REGISTER
// ==========================

const register = async (req, res) => {
  try {
    if (!requireSupabase(res)) return;
    const { name, email, password } = req.body;

    // Check fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: { data: { name } },
    });

    if (error) throw error;

    res.status(201).json({
      message: data.session ? "Registration successful" : "Check your email to confirm your account",
      token: data.session?.access_token || null,
      user: data.user ? { id: data.user.id, name, email: data.user.email } : null,
    });
  } catch (error) {
    console.error(error);

    res.status(error.status || 400).json({
      message: getAuthErrorMessage(error, "Registration failed"),
    });
  }
};

// ==========================
// LOGIN
// ==========================

const login = async (req, res) => {
  try {
    if (!requireSupabase(res)) return;
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });

    if (error) throw error;

    res.status(200).json({
      message: "Login successful",
      token: data.session.access_token,
      user: { id: data.user.id, name: data.user.user_metadata?.name || "", email: data.user.email },
    });
  } catch (error) {
    console.error(error);

    res.status(error.status === 500 ? 500 : 401).json({
      message: error.message || "Invalid email or password",
    });
  }
};

module.exports = {
  register,
  login,
};