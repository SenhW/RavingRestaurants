var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant");

// INDEX - show all restaurants
router.get("/", function(req, res) {
	// Get all restaurants from database
	Restaurant.find({}, function(err, allRestaurants) {
		if(err) {
			console.log(err);
		} else {
			res.render("restaurants/index", {restaurants:allRestaurants})
		}
	});
});

// CREATE - add new restaurant to database
router.post("/", isLoggedIn, function(req, res) {
	// Get data from form and add to restaurants array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newRestaurant = {name: name, image: image, description: desc, author: author}
	// Create a new restaurant and save to database
	Restaurant.create(newRestaurant, function(err, newlyCreated) {
		if(err) {
			console.log(err);
		} else {
			// Redirect back to restaurants page
			res.redirect("/restaurants");
		}
	});
});

// NEW - show form to create new restaurant
router.get("/new", isLoggedIn, function(req, res) {
	res.render("restaurants/new");
});

// SHOW - shows more info about one restaurant
router.get("/:id", function(req, res) {
	// Find the restaurant with provided ID
	Restaurant.findById(req.params.id).populate("comments").exec(function(err, foundRestaurant) {
		if(err) {
			console.log(err);
		} else {
			// Render show template with that restaurant
			res.render("restaurants/show", {restaurant: foundRestaurant});
		}
	});
});

// EDIT - Shows edit form
router.get("/:id/edit", function(req, res) {
	Restaurant.findById(req.params.id, function(err, foundRestaurant) {
		if(err) {
			res.redirect("/restaurants")
		} else {
			res.render("restaurants/edit", {restaurant: foundRestaurant});
		}
	});
});

// UPDATE - Edit restaurant to database
router.put("/:id", function(req, res) {
	// Find and update the correct restaurant
	Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updatedRestaurant) {
		if(err) {
			res.redirect("/restaurants");
		} else {
			res.redirect("/restaurants/" + req.params.id);
		}
	});
	// Redirect to show page
});

// Middleware
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;