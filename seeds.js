var mongoose = require("mongoose");
var Restaurant = require("./models/restaurant");
var Comment = require("./models/comment");

var data = [
	{
		name: "Five Star Restaurant", 
		image: "https://farm6.staticflickr.com/5495/12175878403_bb34ee63d3.jpg",
		description: "This is a huge restaurant that serves quality food."
	},
	{
		name: "Kyu Japanese Restaurant", 
		image: "https://farm4.staticflickr.com/3218/3031753372_227c77327b.jpg",
		description: "Great Japanese food!"
	},
	{
		name: "Dense Tavern", 
		image: "https://farm3.staticflickr.com/2372/2538659579_e60bf044e6.jpg",
		description: "Lovely old-fashioned restaurant"
	}
]
function seedDB() {
	// Remove all restaurants
	Restaurant.remove({}, function(err) {
		if(err) {
			console.log(err);
		}
		console.log("Removed restaurants");
		// Add a few restaurants
		data.forEach(function(seed) {
			Restaurant.create(seed, function(err, restaurant) {
				if(err) {
					console.log(err);
				} else {
					console.log("Added a restaurant");
					// Create a comment
					Comment.create(
						{
							text: "This place is great",
							author: "Homer"
						}, function(err, comment) {
							if(err) {
								console.log(err);
							} else {
								restaurant.comments.push(comment);
								restaurant.save();
								console.log("Created new comment");
							}
						});
				}
			});
		});
	});
	// Add a few comments
}

module.exports = seedDB;