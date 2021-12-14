const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const uniqueValidator = require("mongoose-unique-validator");

const CategorySchema = new mongoose.Schema(
	{
		categories: { type: Array, default: null },
	},
	{ timestamps: true }
);
CategorySchema.plugin(mongoosePaginate);
CategorySchema.plugin(uniqueValidator, { message: "is already taken." });
module.exports = mongoose.model("Categorie", CategorySchema);
