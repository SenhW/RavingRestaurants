var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Restaurant = require("../models/restaurant");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var config = require("../config");

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

// Forgot password
router.get("/forgot", function(req, res) {
	res.render("forgot");
});

// Send email with link to retrieve password
router.post("/forgot", function(req, res, next) {
	async.waterfall([
		function(done) {
			crypto.randomBytes(20, function(err, buf) {
				if(err) {
					req.flash("error", "Unfortunately, something went wrong");
					return res.redirect("/restaurants");
				}
				var token = buf.toString('hex');
        		done(err, token);
      		});
	    },
	    function(token, done) {
      		User.findOne({ email: req.body.email }, function(err, user) {
        		if (!user) {
          			req.flash("error", "No account with that email address exists.");
          			return res.redirect("/forgot");
        		}
				if(err) {
					req.flash("error", "Unfortunately, something went wrong");
					return res.redirect("/restaurants");
				}
        		user.resetPasswordToken = token;
        		user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        		user.save(function(err) {
	        		if(err) {
						req.flash("error", "Unfortunately, something went wrong");
						return res.redirect("/restaurants");
					}
          			done(err, token, user);
        		});
      		});
    	},
    	function(token, user, done) {
      		var smtpTransport = nodemailer.createTransport({
	        	service: "Gmail", 
	        	auth: {
	          		user: config.email,
	          		pass: config.password
	        	}
      		});
	      	var mailOptions = {
	        	to: user.email,
	        	from: config.email,
	        	subject: "RavingRestaurants Password Reset",
	        	text: "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
	          		"Please click on the following link, or paste this into your browser to complete the process:\n\n" +
	          		"http://" + req.headers.host + "/reset/" + token + "\n\n" +
	          		"If you did not request this, please ignore this email and your password will remain unchanged.\n"
	      	};
	      	smtpTransport.sendMail(mailOptions, function(err) {
	      		if(err) {
					req.flash("error", "Unfortunately, something went wrong");
					return res.redirect("/restaurants");
				}
	        	req.flash("success", "An e-mail has been sent to " + user.email + " with further instructions.");
	        	done(err, "done");
	      	});
    	}
  	], function(err) {
    	if (err) return next(err);
    	res.redirect("/forgot");
  	});
});

// Render password reset form
router.get("/reset/:token", function(req, res) {
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
		if(err) {
			req.flash("error", "Unfortunately, something went wrong");
			return res.redirect("/restaurants");
		}
		if(!user) {
			req.flash("error", "Password reset token is invalid or has expired.");
			return res.redirect("/forgot");
		}
		res.render("reset", {token: req.params.token});
	});
});

// Update password
router.post("/reset/:token", function(req, res) {
	async.waterfall([
		function(done) {
			User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
				if(!user) {
					req.flash("error", "Password reset token is invalid or has expired.");
					return res.redirect("back");
				}
				if(err) {
					req.flash("error", "Unfortunately, something went wrong");
					return res.redirect("/restaurants");
				}
				if(req.body.password === req.body.confirm) {
					user.setPassword(req.body.password, function(err) {
						user.resetPasswordToken = undefined;
						user.resetPasswordExpires = undefined;

						user.save(function(err) {
							req.logIn(user, function(err) {
								done(err, user);
							});
						});
					})
				} else {
					req.flash("error", "Passwords do not match.");
					return res.redirect("back");
				}
			});
		},
		function(user, done) {
			var smtpTransport = nodemailer.createTransport({
				service: "Gmail",
				auth: {
					user: config.email,
					pass: config.password
				}
			});
			var mailOptions = {
				to: user.email,
				from: config.email,
				subject: "Your password has been changed",
				text: "Hello,\n\n" +
					"This is a confirmation that the password for your account " + user.email + " has just been changed.\n"
			};
			smtpTransport.sendMail(mailOptions, function(err) {
				req.flash("success", "Success! Your password has been changed.");
				done(err);
			});
		}
	], function(err) {
		res.redirect("/restaurants");
	});
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