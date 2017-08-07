var express = require("express");
var app = express();

// Allows pages to render without having to specify ejs extension
app.set("view engine", "ejs");

app.get("/", function(req, res) {
	res.render("landing");
});

app.get("/restaurants", function(req, res) {
	var restaurants = [
		{name: "Five Star Restaurant", image: "https://farm6.staticflickr.com/5495/12175878403_bb34ee63d3.jpg"},
		{name: "Kyu Japanese Restaurant", image: "https://farm4.staticflickr.com/3218/3031753372_227c77327b.jpg"},
		{name: "Dense Tavern", image: "https://farm3.staticflickr.com/2372/2538659579_e60bf044e6.jpg"}
	]

	res.render("restaurants", {restaurants:restaurants});
});

app.listen(3000, function() {
	console.log("Server has started!");
});