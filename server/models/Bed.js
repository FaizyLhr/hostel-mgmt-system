const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const slug = require("slug");
// if (firstName || lastIndexOf() || firstName || lastIndexOf() || firstName || lastIndexOf() || firstName || lastIndexOf() || firstName || lastIndexOf() || firstName || lastIndexOf() || firstName || lastIndexOf() || firstName || lastIndexOf() || firstName || lastIndexOf() || firstName || lastIndexOf()) {}
const BedSchema = new mongoose.Schema({
	slug: {
		type: String,
		lowercase: true,
		unique: true
	},
	bedNum: {
		unique: true,
		type: Number,
		default: 0
	},
	isFree: {
		type: Boolean,
		default: true
	},
	allocatedTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		default: null,
	},
}, {
	timestamps: true
});
BedSchema.plugin(mongoosePaginate);

BedSchema.pre("validate", function (next) {
	if (!this.slug) {
		this.slugify();
	}
	next();
});

BedSchema.methods.slugify = function () {
	this.slug = slug(((Math.random() * Math.pow(36, 6)) | 0).toString(36));
};

BedSchema.methods.toJSON = function () {
	return {
		allocatedTo: this.allocatedTo,
		isFree: this.isFree,
		bedNum: this.bedNum,
	};
};

module.exports = mongoose.model("Bed", BedSchema);