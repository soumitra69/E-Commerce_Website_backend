const supabase = require("../config/supabase");

const requireSupabase = (res) => {
  if (!supabase) {
    res.status(503).json({ message: "Supabase environment variables are not configured" });
    return false;
  }

  return true;
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

    res.status(500).json({
      message: "Server error",
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

    res.status(500).json({
      message: "Server error",
    });
  }
};

const sendOtp = async (req, res) => {
  try {
    if (!requireSupabase(res)) return;
    const { email, phone, name } = req.body;
    if (!email && !phone) return res.status(400).json({ message: "Email or phone is required" });

    const { error } = await supabase.auth.signInWithOtp({
      ...(email ? { email: email.toLowerCase() } : { phone }),
      options: { shouldCreateUser: true, data: name ? { name } : undefined },
    });

    if (error) throw error;
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || "Could not send OTP" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    if (!requireSupabase(res)) return;
    const { email, phone, token } = req.body;
    if ((!email && !phone) || !token) return res.status(400).json({ message: "Contact and OTP are required" });

    const { data, error } = await supabase.auth.verifyOtp({
      ...(email ? { email: email.toLowerCase(), type: "email" } : { phone, type: "sms" }),
      token,
    });

    if (error) throw error;
    res.json({
      message: "OTP verified successfully",
      token: data.session.access_token,
      user: { id: data.user.id, name: data.user.user_metadata?.name || "", email: data.user.email, phone: data.user.phone },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || "Invalid OTP" });
  }
};

module.exports = {
  register,
  login,
  sendOtp,
  verifyOtp,
};