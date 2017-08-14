var express     = require("express"),
	app         = express(),
	bodyParser  = require("body-parser"),
	mongoose    = require("mongoose"),
	flash       = require("connect-flash"),
	passport    = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Restaurant  = require("./models/restaurant"),
	Comment     = require("./models/comment"),
	User        = require("./models/user"),
	seedDB      = require("./seeds")

// Requiring routes
var commentRoutes    = require("./routes/comments"),
	restaurantRoutes = require("./routes/restaurants"),
	indexRoutes      = require("./routes/index")

// Require config api key for Google Maps
var config = require("./config");

// CONFIGURATION
mongoose.connect("mongodb://localhost/raving_restaurants");
// Parses request bodies
app.use(bodyParser.urlencoded({extended: true}));
// Allows pages to render without having to specify ejs extension
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // Seed the database

app.locals.moment = require("moment");

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

// Pass in req.user to every route
app.use(function(req, res, next) {
	// res.locals refers to whatever is inside route
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.google_api = config.google_api;
	next();
});

app.use("/", indexRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/restaurants/:id/comments", commentRoutes);

app.listen(3000, function() {
	console.log("Server has started!");
});