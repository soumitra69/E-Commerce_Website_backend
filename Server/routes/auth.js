const express = require("express");

const {
  register,
  login,
} = require("../controllers/authController");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Auth API is running",
    endpoints: ["POST /register", "POST /login"],
  });
});

router.post("/register", register);

router.post("/login", login);

module.exports = router;