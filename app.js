const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const path = require("path");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// INITIALIZE APP
const app = express();

// MODELS
require("./models/User");

// CONFIGS
// mongoDB
const db_secret_key = require("./config/db_secret_key");
// passport
require("./config/passport")(passport);

// CONNECT TO DB
mongoose
  .connect(db_secret_key.mongoURI)
  .then(() => console.log("we are connected to our DB"))
  .catch(err => console.log(err));

// MIDDLEWARES
// cookie-parser
app.use(cookieParser());
// express-session
app.use(
  session({
    secret: db_secret_key.secretOrKey,
    // secret: "SuperDuperSecret",
    resave: false,
    saveUninitialized: false
  })
);
// passport
app.use(passport.initialize());
app.use(passport.session());
// express-handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// GLOBAL VARIABLES
app.use((req, res, next) => {
  // have access to current user data via the user variable, thanks to passport
  res.locals.user = req.user || null;
  next();
});

// ROUTES
const index = require("./routes/index");
const auth = require("./routes/auth");

// USE ROUTES
app.use("/", index);
app.use("/auth", auth);

// STATIC FOLDER
app.use(express.static(path.join(__dirname, "public")));

// SET PORT
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`we are live at ${port}`);
});
