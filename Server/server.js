require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const configuredOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => {
    try {
      return new URL(origin.trim()).origin;
    } catch {
      return origin.trim().replace(/\/$/, "");
    }
  })
  .filter(Boolean);

app.use(cors({
  origin: configuredOrigins.length ? configuredOrigins : true,
}));
app.use(express.json());


// Test environment variables
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log(
  "SUPABASE_KEY:",
  process.env.SUPABASE_KEY ? "Loaded" : "Missing"
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