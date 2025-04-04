require("dotenv").config();
const express = require("express");
const axios = require("axios");
const mongoose = require("./config/db"); // Your DB config
const bodyParser = require("body-parser");
const cors = require("cors");
const user = require("./controllers/userController");
const consulMiddleware = require("./middleware/consul"); // Import Consul middleware

const app = express();
const PORT = process.env.PORT || 7000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(consulMiddleware); // Use Consul middleware if needed

// Routes
app.use("/user", user);
app.get("/", (req, res) => res.send("Server is awake!")); // Keep-alive endpoint

// Keep-Alive Logic
const KEEP_ALIVE_URL = "https://express-user-ccqv.onrender.com";

const sendKeepAlive = async () => {
  try {
    const response = await axios.get(KEEP_ALIVE_URL, { timeout: 10000 });
    console.log("✅ Keep-alive request sent. Status:", response.status);
  } catch (err) {
    console.error("❌ Keep-alive request failed:", err.message);
  }
};

setTimeout(() => {
  sendKeepAlive(); // Initial call
  setInterval(sendKeepAlive, 300000); // Every 5 minutes
}, 10000);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});