const express = require("express");
const router = express.Router();

// GET | display root/home/index
router.get("/", (req, res) => {
  res.render("index/welcome");
});

// GET | display dashboard
router.get("/dashboard", (req, res) => {
  res.send("dashboard");
});

module.exports = router;
