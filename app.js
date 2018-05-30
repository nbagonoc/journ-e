const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const passport = require("passport");

// INITIALIZE APP
const app = express();

// STATIC FOLDER
app.use(express.static(path.join(__dirname, "public")));

// CONFIGS
// mongoDB
const db = require("./config/db_secret_key");
// passport
require("./config/passport")(passport);

// CONNECT TO DB
mongoose
  .connect(db.mongoURI)
  .then(() => console.log("we are connected to our DB"))
  .catch(err => console.log(err));

// ROUTES
const auth = require("./routes/auth");

// USE ROUTES
app.use("/auth", auth);

// INITIAL ROUTE
app.get("/", (req, res) => {
  res.send("it works");
});

// SET PORT
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`we are live at ${port}`);
});
