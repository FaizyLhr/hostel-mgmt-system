const mongoose = require("mongoose");
const slug = require("slug");

const ProductSchema = new mongoose.Schema(
	{
		slug: { type: String, unique: true, required: true, trim: true },
	},
	{ timestamps: true }
);

ProductSchema.pre("validate", function (next) {
	if (!this.slug) {
		this.slugify();
	}
	next();
});

ProductSchema.methods.slugify = function () {
	this.slug = slug(((Math.random() * Math.pow(36, 6)) | 0).toString(36));
};

ProductSchema.methods.toJSON = function () {
	return {
		product: {
			slug: this.slug,
			numFloor: this.numFloor,
			addFloor: this.addFloor,
			spots: this.spots,
		},
	};
};

module.exports = mongoose.model("Product", ProductSchema);
