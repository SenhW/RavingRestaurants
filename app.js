var express = require("express");
var app = express();
var bodyParser = require("body-parser");

// Parses request bodies
app.use(bodyParser.urlencoded({extended: true}));
// Allows pages to render without having to specify ejs extension
app.set("view engine", "ejs");

var restaurants = [
	{name: "Five Star Restaurant", image: "https://farm6.staticflickr.com/5495/12175878403_bb34ee63d3.jpg"},
	{name: "Kyu Japanese Restaurant", image: "https://farm4.staticflickr.com/3218/3031753372_227c77327b.jpg"},
	{name: "Dense Tavern", image: "https://farm3.staticflickr.com/2372/2538659579_e60bf044e6.jpg"}
];

app.get("/", function(req, res) {
	res.render("landing");
});

// Lists all restaurants
app.get("/restaurants", function(req, res) {
	res.render("restaurants", {restaurants:restaurants});
});

app.post("/restaurants", function(req, res) {
	// Get data from form and add to restaurants array
	var name = req.body.name;
	var image = req.body.image;
	var newRestaurant = {name: name, image: image}
	restaurants.push(newRestaurant);
	// Redirect back to restaurants page
	res.redirect("/restaurants");
});

// Shows the form to submit new restaurant
app.get("/restaurants/new", function(req, res) {
	res.render("new");
});

app.listen(3000, function() {
	console.log("Server has started!");
});