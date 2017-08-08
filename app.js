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
	image: String,
	description: String
});

// Compile restaurant into a model
var Restaurant = mongoose.model("Restaurant", restaurantSchema);

// Restaurant.create(
// 	{
// 		name: "Five Star Restaurant",
// 		image: "https://farm6.staticflickr.com/5495/12175878403_bb34ee63d3.jpg",
// 		description: "This is a huge restaurant that serves quality food."
// 	},
// 	function(err, restaurant) {
// 		if(err) {
// 			console.log(err);
// 		} else {
// 			console.log("NEWLY CREATED RESTAURANT: ");
// 			console.log(restaurant);
// 		}
// 	});

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
			res.render("index", {restaurants:allRestaurants})
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

// NEW - show from to create new restaurant
app.get("/restaurants/new", function(req, res) {
	res.render("new");
});

app.get("/restaurants/:id", function(req, res) {
	// Find the restaurant with provided ID
	Restaurant.findById(req.params.id, function(err, foundRestaurant) {
		if(err) {
			console.log(err);
		} else {
			// Render show template with that restaurant
			res.render("show", {restaurant: foundRestaurant});
		}
	});
});

app.listen(3000, function() {
	console.log("Server has started!");
});