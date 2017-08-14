var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant");
var middleware = require("../middleware");
var geocoder = require("geocoder");

// INDEX - show all restaurants
router.get("/", function(req, res) {
	// Get all restaurants from database
	Restaurant.find({}, function(err, allRestaurants) {
		if(err) {
			console.log(err);
		} else {
			res.render("restaurants/index", {restaurants: allRestaurants, page: 'restaurants'});
		}
	});
});

// CREATE - add new restaurant to database
router.post("/", middleware.isLoggedIn, function(req, res) {
	// Get data from form and add to restaurants array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	geocoder.geocode(req.body.location, function(err, data) {
		var lat = data.results[0].geometry.location.lat;
		var lng = data.results[0].geometry.location.lng;
		var location = data.results[0].formatted_address;
		var newRestaurant = {name: name, image: image, description: desc, author: author, location: location, lat: lat, lng: lng};
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
});

// NEW - show form to create new restaurant
router.get("/new", middleware.isLoggedIn, function(req, res) {
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
router.get("/:id/edit", middleware.checkRestaurantOwnership, function(req, res) {
	Restaurant.findById(req.params.id, function(err, foundRestaurant) {
		res.render("restaurants/edit", {restaurant: foundRestaurant});
	});
});

// UPDATE - Edit restaurant to database
router.put("/:id", middleware.checkRestaurantOwnership, function(req, res) {
	geocoder.geocode(req.body.restaurant.location, function(err, data) {
		var lat = data.results[0].geometry.location.lat;
		var lng = data.results[0].geometry.location.lng;
		var location = data.results[0].formatted_address;
		var newData = {name: req.body.restaurant.name, image: req.body.restaurant.image, description: req.body.restaurant.description, location: req.body.restaurant.location, lat: lat, lng: lng};
		// Find and update the correct restaurant
		Restaurant.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedRestaurant) {
			if(err) {
				req.flash("error", err.message);
				res.redirect("back");
			} else {
				req.flash("success", "Successfully Updated!");
				// Redirect to show page
				res.redirect("/restaurants/" + updatedRestaurant.id);
			}
		});
	});
});

// DESTROY - Delete restaurant from database
router.delete("/:id", middleware.checkRestaurantOwnership, function(req, res) {
	Restaurant.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			res.redirect("/restaurants");
		} else {
			res.redirect("/restaurants");
		}
	})
});

module.exports = router;