var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant")
var Comment = require("../models/comment")

// NEW - show form to add new comment
router.get("/restaurants/:id/comments/new", isLoggedIn, function(req, res) {
	// Find restaurant by id
	Restaurant.findById(req.params.id, function(err, restaurant) {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {restaurant: restaurant});
		}
	});
});

// CREATE - Add new comment to database
router.post("/restaurants/:id/comments", isLoggedIn, function(req, res) {
	// Lookup restaurant using ID
	Restaurant.findById(req.params.id, function(err, restaurant) {
		if(err) {
			console.log(err);
			res.redirect("/restaurants");
		} else {
			// Create new comment
			Comment.create(req.body.comment, function(err, comment) {
				if(err) {
					console.log(err);
				} else {
					// Connect new comment to restaurant
					restaurant.comments.push(comment);
					restaurant.save();
					// Redirect restaurant show page
					res.redirect("/restaurants/" + restaurant._id);
				}
			});
		}
	});
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;