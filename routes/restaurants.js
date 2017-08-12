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
router.get("/:id/edit", checkRestaurantOwnership, function(req, res) {
	Restaurant.findById(req.params.id, function(err, foundRestaurant) {
		res.render("restaurants/edit", {restaurant: foundRestaurant});
	});
});

// UPDATE - Edit restaurant to database
router.put("/:id", checkRestaurantOwnership, function(req, res) {
	// Find and update the correct restaurant
	Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updatedRestaurant) {
		if(err) {
			res.redirect("/restaurants");
		} else {
			// Redirect to show page
			res.redirect("/restaurants/" + req.params.id);
		}
	});
});

// DESTROY - Delete restaurant from database
router.delete("/:id", checkRestaurantOwnership, function(req, res) {
	Restaurant.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			res.redirect("/restaurants");
		} else {
			res.redirect("/restaurants");
		}
	})
});

// Middleware
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

function checkRestaurantOwnership(req, res, next) {
	// Is user logged in?
	if(req.isAuthenticated()) {
		Restaurant.findById(req.params.id, function(err, foundRestaurant) {
			if(err) {
				res.redirect("back")
			} else {
				// Does user own the restaurant?
				if(foundRestaurant.author.id.equals(req.user._id)) {
					next();
				} 
				// Otherwise, redirect
				else {
					res.redirect("back");
				}
			}
		});
	} 
	// If not, redirect	
	else {
		res.redirect("back");
	}
}

module.exports = router;