require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
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


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});