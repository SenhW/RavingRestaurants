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

// EDIT - show form to edit comment
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if(err) {
			res.redirect("back");
		} else {
			res.render("comments/edit", {restaurant_id: req.params.id, comment: foundComment});
		}
	});
});

// UPDATE - Edit comment into database
router.put("/:comment_id", checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if(err) {
			res.redirect("back");
		} else {
			res.redirect("/restaurants/" + req.params.id);
		}
	});
});

// DESTROY - Delete comment from database
router.delete("/:comment_id", checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if(err) {
			res.redirect("back");
		} else {
			res.redirect("/restaurants/" + req.params.id);
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

function checkCommentOwnership(req, res, next) {
	// Is user logged in?
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if(err) {
				res.redirect("back")
			} else {
				// Does user own the comment?
				if(foundComment.author.id.equals(req.user._id)) {
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