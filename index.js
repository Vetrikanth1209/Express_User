require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const user = require("./controllers/userController");
const consul = require("./middleware/consul")

const app = express();
const PORT = process.env.PORT || 7000;

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Routes
app.use("/user", user);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});