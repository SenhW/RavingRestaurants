var express     = require("express");
	app         = express();
	bodyParser  = require("body-parser");
	mongoose    = require("mongoose");

mongoose.connect("mongodb://localhost/raving_restaurants");
// Parses request bodies
app.use(bodyParser.urlencoded({extended: true}));
// Allows pages to render without having to specify ejs extension
app.set("view engine", "ejs");

// SCHEMA SETUP
var restaurantSchema = new mongoose.Schema({
	name: String,
	image: String
});

// Compile restaurant into a model
var Restaurant = mongoose.model("Restaurant", restaurantSchema);

app.get("/", function(req, res) {
	res.render("landing");
});

// Lists all restaurants
app.get("/restaurants", function(req, res) {
	// Get all restaurants from database
	Restaurant.find({}, function(err, allRestaurants) {
		if(err) {
			console.log(err);
		} else {
			res.render("restaurants", {restaurants:allRestaurants})
		}
	});
});

app.post("/restaurants", function(req, res) {
	// Get data from form and add to restaurants array
	var name = req.body.name;
	var image = req.body.image;
	var newRestaurant = {name: name, image: image}
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

// Shows the form to submit new restaurant
app.get("/restaurants/new", function(req, res) {
	res.render("new");
});

app.listen(3000, function() {
	console.log("Server has started!");
});