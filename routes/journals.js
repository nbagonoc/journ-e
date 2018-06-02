const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Journal = mongoose.model("journals");
const User = mongoose.model("users");
const { ensureAuthenticated } = require("../helpers/auth");

// GET | journal index, display all public journal
router.get("/", (req, res) => {
  Journal.find({ status: "public" })
    .populate("user")
    .sort({ date: "desc" })
    .then(journals => {
      res.render("journals/index", {
        journals
      });
    });
});

// GET | display all public journal from a specific user
router.get("/user/:userId", (req, res) => {
  Journal.find({ user: req.params.userId, status: "public" })
    .populate("user")
    .sort({ date: "desc" })
    .then(journals => {
      res.render("journals/index", {
        journals
      });
    });
});

// GET | display all personal journal of a loggedin user
router.get("/personal", ensureAuthenticated, (req, res) => {
  Journal.find({ user: req.user.id })
    .populate("user")
    .sort({ date: "desc" })
    .then(journals => {
      res.render("journals/index", {
        journals
      });
    });
});

// GET | display single journal
router.get("/show/:id", (req, res) => {
  Journal.findOne({ _id: req.params.id })
    .populate("user")
    .populate("comments.commentUser")
    .then(journal => {
      if (journal.status == "public") {
        res.render("journals/show", {
          journal
        });
      } else {
        if (req.user) {
          if (req.user.id == journal.user._id) {
            res.render("journals/show", {
              journal
            });
          } else {
            req.flash("error_msg", "Not authorized");
            res.redirect("/journals");
          }
        } else {
          req.flash("error_msg", "Not authorized");
          res.redirect("/journals");
        }
      }
    });
});

// GET | add journal form
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("journals/add");
});

// POST | add journal process
router.post("/add", ensureAuthenticated, (req, res) => {
  let allowComments;

  // if allow comments is checked, change the value to true, if none, change to false
  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  // get values from the form
  const newJournal = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments,
    user: req.user.id
  };

  // validator
  req.check("title", "title is required").notEmpty();
  req.check("body", "content is required").notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    res.render("journals/add", { errors });
  } else {
    // send values to DB, and redirect to the dashboard
    new Journal(newJournal).save().then(journal => {
      req.flash("success_msg", "You have successfully added a journal");
      res.redirect("/dashboard");
    });
  }
});

// GET | display edit form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Journal.findOne({ _id: req.params.id }).then(journal => {
    if (journal.user != req.user.id) {
      req.flash("error_msg", "Not authorized");
      res.redirect("/journals");
    } else {
      res.render("journals/edit", {
        journal
      });
    }
  });
});

// PATCH | edit form process
router.patch("/edit/:id", ensureAuthenticated, (req, res) => {
  Journal.findOne({ _id: req.params.id }).then(journal => {
    let allowComments;

    // if allow comments is checked, change the value to true, if none, change to false
    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }

    // update the values
    journal.title = req.body.title;
    journal.body = req.body.body;
    journal.status = req.body.status;
    journal.allowComments = allowComments;

    // validator
    req.check("title", "title is required").notEmpty();
    req.check("body", "content is required").notEmpty();

    const errors = req.validationErrors();

    if (errors) {
      res.render("journals/edit", { errors });
    } else {
      // send updated values to DB, and redirect to dashboard
      journal.save().then(journal => {
        req.flash("success_msg", "You have successfully edited your journal");
        res.redirect("/dashboard");
      });
    }
  });
});

// DELETE | delete a journal
router.delete("/delete/:id", ensureAuthenticated, (req, res) => {
  Journal.remove({ _id: req.params.id }).then(() => {
    req.flash("success_msg", "You have successfully deleted a journal");
    res.redirect("/dashboard");
  });
});

// POST | Add comment to a journal process
router.post("/comment/:id", ensureAuthenticated, (req, res) => {
  Journal.findOne({ _id: req.params.id }).then(journal => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    };

    // Add to comments array
    journal.comments.unshift(newComment);

    // send to DB, and redirect to journal
    journal.save().then(journal => {
      req.flash(
        "success_msg",
        "You have successfully made a comment to this journal"
      );
      res.redirect(`/journals/show/${journal.id}`);
    });
  });
});

module.exports = router;
