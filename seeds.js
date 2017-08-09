var mongoose = require("mongoose");
var Restaurant = require("./models/restaurant");
var Comment = require("./models/comment");

var data = [
	{
		name: "Five Star Restaurant", 
		image: "https://farm6.staticflickr.com/5495/12175878403_bb34ee63d3.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum risus velit, fermentum quis metus eu, mattis viverra leo. Pellentesque vulputate scelerisque dapibus. Cras interdum, dui et cursus lacinia, tortor est dapibus nibh, non hendrerit justo tortor ut nunc. Nulla fermentum vitae nisi et fringilla. In faucibus sapien nec condimentum congue. Quisque sed justo in sapien egestas finibus eget eget dolor. Mauris sagittis justo justo, id pharetra tortor eleifend ac. Etiam vestibulum viverra dui, quis ullamcorper ipsum varius eu."
	},
	{
		name: "Kyu Japanese Restaurant", 
		image: "https://farm4.staticflickr.com/3218/3031753372_227c77327b.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum risus velit, fermentum quis metus eu, mattis viverra leo. Pellentesque vulputate scelerisque dapibus. Cras interdum, dui et cursus lacinia, tortor est dapibus nibh, non hendrerit justo tortor ut nunc. Nulla fermentum vitae nisi et fringilla. In faucibus sapien nec condimentum congue. Quisque sed justo in sapien egestas finibus eget eget dolor. Mauris sagittis justo justo, id pharetra tortor eleifend ac. Etiam vestibulum viverra dui, quis ullamcorper ipsum varius eu."
	},
	{
		name: "Dense Tavern", 
		image: "https://farm3.staticflickr.com/2372/2538659579_e60bf044e6.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum risus velit, fermentum quis metus eu, mattis viverra leo. Pellentesque vulputate scelerisque dapibus. Cras interdum, dui et cursus lacinia, tortor est dapibus nibh, non hendrerit justo tortor ut nunc. Nulla fermentum vitae nisi et fringilla. In faucibus sapien nec condimentum congue. Quisque sed justo in sapien egestas finibus eget eget dolor. Mauris sagittis justo justo, id pharetra tortor eleifend ac. Etiam vestibulum viverra dui, quis ullamcorper ipsum varius eu."
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