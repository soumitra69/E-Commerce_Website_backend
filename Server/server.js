require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const DEFAULT_CLIENT_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://full-stack-ecommerse-website.vercel.app",
];

const normalizeOrigin = (origin) => {
  if (!origin) return "";

  const trimmedOrigin = origin.trim();

  try {
    return new URL(trimmedOrigin).origin;
  } catch {
    return trimmedOrigin.replace(/\/$/, "");
  }
};

const configuredOrigins = [
  ...DEFAULT_CLIENT_ORIGINS,
  ...(process.env.CLIENT_URL || process.env.FRONTEND_URL || "")
  .split(",")
  .map(normalizeOrigin),
].filter(Boolean);

const allowedOrigins = new Set(configuredOrigins);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(normalizeOrigin(origin))) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
}));
app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON body" });
  }

  if (err.message?.includes("not allowed by CORS")) {
    return res.status(403).json({ message: "Origin not allowed by CORS" });
  }

  next(err);
});

// Test environment variables
console.log(
  "Supabase config:",
  process.env.SUPABASE_URL && process.env.SUPABASE_KEY ? "Loaded" : "Missing"
);


// Routes
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/auth");

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.json({
    message: "Norden API is running",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
