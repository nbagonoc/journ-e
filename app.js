const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");
const expressValidator = require("express-validator");
const flash = require("connect-flash");

// INITIALIZE APP
const app = express();

// MODELS
require("./models/User");
require("./models/Journal");

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

// HELPERS
const {
  truncate,
  stripper,
  formatDate,
  select,
  editableIfUser
} = require("./helpers/hbs");

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
// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// express validator
app.use(expressValidator());
// connect flash
app.use(flash());
// Global consts
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.errors = req.flash("errors");
  next();
});
// method-override
app.use(methodOverride("_method"));
// express-handlebars
app.engine(
  "handlebars",
  exphbs({
    helpers: {
      // truncates the journals at the public journals
      truncate,
      // strips the HTML tag at the public journals
      stripper,
      // formats the date using moment
      formatDate,
      // selects the properly selected option for the edit form page
      select,
      // shows the edit button if you are the user on journals
      editableIfUser
    },
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
const journals = require("./routes/journals");

// USE ROUTES
app.use("/", index);
app.use("/auth", auth);
app.use("/journals", journals);

// STATIC FOLDER
app.use(express.static(path.join(__dirname, "public")));

// SET PORT
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`we are live at ${port}`);
});
