const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Journal = mongoose.model("journals");
const { ensureAuthenticated } = require("../helpers/auth");

// GET | display root/home/index
router.get("/", (req, res) => {
  res.render("index/welcome");
});

// GET | display dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  Journal.find({ user: req.user.id })
    .sort({ date: "desc" })
    .then(journals => {
      res.render("index/dashboard", {
        journals
      });
    });
});

module.exports = router;
