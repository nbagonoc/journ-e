const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

// INITIALIZE APP
const app = express();

// STATIC FOLDER
app.use(express.static(path.join(__dirname, "public")));

// INITIAL ROUTE
app.get("/", (req, res) => {
  res.send("it works");
});

// SET PORT
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`we are live at ${port}`);
});
