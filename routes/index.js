var express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  User = require("../models/user");

router.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

router.get("/", function (req, res) {
  res.render("landing");
});

//===========
//Auth Routes
//===========

//show register form
router.get("/register", function (req, res) {
  res.render("register")
});

//handle sing up logic
router.post("/register", function (req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("register");
    }
    passport.authenticate("local")(req, res, function () {
      req.flash("success", "User profile created!")
      res.redirect("/campgrounds")
    });
  });
});

//Show Login Form
router.get("/login", function (req, res) {
  res.render("login");
});

//login POST route
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),
  function (req, res) { });

//logout route  
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/campgrounds");
});  

module.exports = router;