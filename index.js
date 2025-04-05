require("dotenv").config();
const express = require("express");
const axios = require("axios");
const mongoose = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const user = require("./controllers/userController");
const consulMiddleware = require("./middleware/consul");

const app = express();
const PORT = process.env.PORT || 7000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(consulMiddleware);

// Routes
app.use("/user", user);
app.get("/", (req, res) => res.send("Server is awake!"));

// Keep-Alive Logic
const KEEP_ALIVE_URL = "https://express-user-ccqv.onrender.com";
const CONSUL_URL = "https://consul-hn1i.onrender.com";

const sendKeepAlive = async (url, name) => {
  try {
    const response = await axios.get(url, { timeout: 10000 });
    console.log(`✅ Keep-alive request to ${name} sent. Status: ${response.status}`);
  } catch (err) {
    console.error(`❌ Keep-alive request to ${name} failed: ${err.message}`);
  }
};

// Ping both services
setTimeout(() => {
  sendKeepAlive(KEEP_ALIVE_URL, "Express app"); // Initial call for Express
  sendKeepAlive(CONSUL_URL, "Consul"); // Initial call for Consul
  setInterval(() => {
    sendKeepAlive(KEEP_ALIVE_URL, "Express app");
    sendKeepAlive(CONSUL_URL, "Consul");
  }, 240000); // Every 5 minutes
}, 10000);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});