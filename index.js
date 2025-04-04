require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const user = require("./controllers/userController");
const consul = require("./middleware/consul");

const app = express();
const PORT = process.env.PORT ;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Called Services

app.use("/user", user);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Prevent Render from sleeping
const keepAliveURL = `https://express-user-ccqv.onrender.com`;

setInterval(() => {
  axios.get(keepAliveURL)
    .then(() => console.log("Keep-alive request sent"))
    .catch(err => console.error("Keep-alive request failed:", err.message));
}, 30000); // Every 30 seconds
