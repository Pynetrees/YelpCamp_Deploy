var express = require("express"),
  router = express.Router(),
  Campground = require("../models/campground"),
  Comment = require("../models/comment"),
  middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function (req, res) {
  req.user
  //GET ALL CAMPGROUNDS FROM DB
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds });
    }
  })
});

//NEW Form - add new campground to DB
router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render("campgrounds/new");
});

//SHOW - Shows more info about one campground
router.get("/:id", function (req, res) {
  //find campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
    if (err) {
      console.log(err)
    } else {
      //render show template with that campground
      res.render("campgrounds/show", { campground: foundCampground });
    }
  });
});

//Create Route
router.post("/", middleware.isLoggedIn, function (req, res) {
  var name = req.body.name,
    image = req.body.image,
    desc = req.body.description,
    author = {
      id: req.user._id,
      username: req.user.username
    },
    newCampground = { name: name, image: image, description: desc, price: price, author: author };
  //CREATE NEW CAMPGROUND & SAVE 2 DATABASE
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  })
});

//EDIT route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    if(err){
      req.flash("error", "There was a probleme retrieving the Edit form.")
      res.redirect("back");
    }
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

//UPDATE route
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//DESTROY route
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res, next) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) return next(err);
    campground.remove();
    res.redirect("/campgrounds");
  });
});

module.exports = router;