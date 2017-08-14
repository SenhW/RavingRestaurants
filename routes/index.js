var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Restaurant = require("../models/restaurant");

// Root route
router.get("/", function(req, res) {
	res.render("landing");
});

// Show register form
router.get("/register", function(req, res) {
	res.render("register", {page: 'register'});
});

// Handle sign up logic
router.post("/register", function(req, res) {
	var newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		avatar: req.body.avatar
	});

	if(req.body.adminCode === 'pizza123') {
		newUser.isAdmin = true;
	}
	
	User.register(newUser, req.body.password, function(err, user) {
		if(err) {
			return res.render("register", {error: err.message});
		}
		passport.authenticate("local")(req, res, function() {
			req.flash("success", "Sucessfully Signed Up! Nice to meet you " + user.username + "!");
			res.redirect("/restaurants");
		});
	});
});

// Show login form
router.get("/login", function(req, res) {
	res.render("login", {page: 'login'});
});

// Handling login logic
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/restaurants",
		failureRedirect: "/login"
	}), function(req, res) {
});

// Logout route
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/restaurants");
});

// USER PROFILE
router.get("/users/:id", function(req, res) {
	User.findById(req.params.id, function(err, foundUser) {
		if(err) {
			req.flash("error", "Something went wrong");
			res.redirect("/restaurants");
		}
		Restaurant.find().where('author.id').equals(foundUser._id).exec(function(err, restaurants) {
			if(err) {
				req.flash("error", "Something went wrong");
				res.redirect("/restaurants");
			}
			res.render("users/show", {user: foundUser, restaurants: restaurants});
		});
	});
});

module.exports = router;