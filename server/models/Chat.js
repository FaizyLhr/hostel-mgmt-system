const mongoose = require("mongoose");
const slug = require("slug");
const mongoosePaginate = require("mongoose-paginate-v2");

const ChatSchema = new mongoose.Schema(
	{
		slug: { type: String, lowercase: true, unique: true },

		friend: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Friend",
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		sentTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		// isDeleted: [
		// 	{
		// 		type: mongoose.Schema.Types.ObjectId,
		// 		ref: "User",
		// 	},
		// ],
		files: [],

		message: String,
		date: {
			type: Date,
			default: Date.now(),
		},

		status: {
			type: Number,
			default: 2,
			enum: [1, 2], //1: Read , 2: Un-Read
		},
	},
	{ timestamps: true }
);

ChatSchema.pre("validate", function (next) {
	if (!this.slug) {
		this.slugify();
	}
	next();
});

ChatSchema.plugin(mongoosePaginate);

ChatSchema.methods.slugify = function () {
	this.slug = slug(((Math.random() * Math.pow(36, 6)) | 0).toString(36));
};

module.exports = mongoose.model("Chat", ChatSchema);
