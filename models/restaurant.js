var mongoose = require("mongoose");

// SCHEMA SETUP
var restaurantSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

// Compile restaurant into a model
module.exports = mongoose.model("Restaurant", restaurantSchema);