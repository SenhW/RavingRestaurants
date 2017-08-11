var express = require("express");
// Set mergeParams equal to true in order to access restaurant id
var router = express.Router({mergeParams: true});
var Restaurant = require("../models/restaurant")
var Comment = require("../models/comment")

// NEW - show form to add new comment
router.get("/new", isLoggedIn, function(req, res) {
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
router.post("/", isLoggedIn, function(req, res) {
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
					// Add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// Save comment
					comment.save();
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

// Middleware
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;