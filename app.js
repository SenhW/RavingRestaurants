var express     = require("express"),
	app         = express(),
	bodyParser  = require("body-parser"),
	mongoose    = require("mongoose"),
	passport    = require("passport"),
	LocalStrategy = require("passport-local"),
	Restaurant  = require("./models/restaurant"),
	Comment     = require("./models/comment"),
	User        = require("./models/user"),
	seedDB      = require("./seeds")

// CONFIGURATION
mongoose.connect("mongodb://localhost/raving_restaurants");
// Parses request bodies
app.use(bodyParser.urlencoded({extended: true}));
// Allows pages to render without having to specify ejs extension
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session") ({
	secret: "Test secret",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res) {
	res.render("landing");
});

// INDEX - show all restaurants
app.get("/restaurants", function(req, res) {
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
app.post("/restaurants", function(req, res) {
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
app.get("/restaurants/new", function(req, res) {
	res.render("restaurants/new");
});

// SHOW - shows more info about one restaurant
app.get("/restaurants/:id", function(req, res) {
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

// ====================
// COMMENTS ROUTES
// ====================

// NEW - show form to add new comment
app.get("/restaurants/:id/comments/new", isLoggedIn, function(req, res) {
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
app.post("/restaurants/:id/comments", isLoggedIn, function(req, res) {
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

// ==============
// AUTH ROUTES
// ==============

// Show register form
app.get("/register", function(req, res) {
	res.render("register");
});

// Handle sign up logic
app.post("/register", function(req, res) {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if(err) {
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function() {
			res.redirect("/restaurants");
		});
	});
});

// Show login form
app.get("/login", function(req, res) {
	res.render("login");
});

// Handling login logic
app.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/restaurants",
		failureRedirect: "/login"
	}), function(req, res) {
});

// Logout route
app.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/restaurants");
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

app.listen(3000, function() {
	console.log("Server has started!");
});