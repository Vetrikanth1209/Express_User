require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const user = require("./controllers/userController");
const consul = require("./middleware/consul");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 7000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Called Services
app.use("/user", user);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 🔴 Prevent Render from sleeping
const KEEP_ALIVE_URL = "https://express-user-ccqv.onrender.com";

setTimeout(() => {
  setInterval(async () => {
    try {
      const response = await axios.get(KEEP_ALIVE_URL);
      console.log("✅ Keep-alive request sent. Status:", response.status);
    } catch (err) {
      console.error("❌ Keep-alive request failed:", err.message);
    }
  }, 30000); // Every 30 seconds
}, 10000); // Initial delay of 10 seconds
