var Restaurant = require("../models/restaurant");
var Comment = require("../models/comment");
// All middleware goes here
var middlewareObj = {};

middlewareObj.checkRestaurantOwnership = function(req, res, next) {
	// Is user logged in?
	if(req.isAuthenticated()) {
		Restaurant.findById(req.params.id, function(err, foundRestaurant) {
			if(err) {
				req.flash("error", "Restaurant not found");
				res.redirect("back")
			} else {
				// Does user own the restaurant?
				if(foundRestaurant.author.id.equals(req.user._id)) {
					next();
				} 
				// Otherwise, redirect
				else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} 
	// If not, redirect	
	else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	// Is user logged in?
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if(err) {
				req.flash("error", "Comment not found");
				res.redirect("back")
			} else {
				// Does user own the comment?
				if(foundComment.author.id.equals(req.user._id)) {
					next();
				} 
				// Otherwise, redirect
				else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} 
	// If not, redirect	
	else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
}

module.exports = middlewareObj