var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant");

// INDEX - show all restaurants
router.get("/restaurants", function(req, res) {
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
router.post("/restaurants", function(req, res) {
	// Get data from form and add to restaurants array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newRestaurant = {name: name, image: image, description: desc}
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
router.get("/restaurants/new", function(req, res) {
	res.render("restaurants/new");
});

// SHOW - shows more info about one restaurant
router.get("/restaurants/:id", function(req, res) {
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

module.exports = router;