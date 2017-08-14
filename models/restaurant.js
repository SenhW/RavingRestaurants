var mongoose = require("mongoose");

// SCHEMA SETUP
var restaurantSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	location: String,
	lat: Number,
	lng: Number,
	createdAt: { type: Date, default: Date.now },
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

// Compile restaurant into a model
module.exports = mongoose.model("Restaurant", restaurantSchema);