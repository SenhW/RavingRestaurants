var Restaurant = require("../models/restaurant");
var Comment = require("../models/comment");
// All middleware goes here
var middlewareObj = {};

middlewareObj.checkRestaurantOwnership = function(req, res, next) {
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

middlewareObj.checkCommentOwnership = function(req, res, next) {
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

middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = middlewareObj