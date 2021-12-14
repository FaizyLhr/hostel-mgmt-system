const mongoose = require("mongoose");
const slug = require("slug");
const mongoosePaginate = require("mongoose-paginate-v2");
let uniqueValidator = require("mongoose-unique-validator");

const TollSchema = new mongoose.Schema(
	{
		slug: { type: String, unique: true, required: true, trim: true },
		project: { type: String, required: true, trim: true },
		area: { type: String, required: true, trim: true },
		trialPrice: { type: Number, default: null },
		singlePrice: { type: Number, default: null },
		groupPrice: { type: Number, default: null },
		yoshinoriPrice: { type: Number, default: null },
		status: { type: Boolean, default: false },
		tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

TollSchema.pre("validate", function (next) {
	if (!this.slug) {
		this.slugify();
	}
	next();
});

TollSchema.plugin(mongoosePaginate);
TollSchema.plugin(uniqueValidator, { message: "is already taken." });

TollSchema.methods.slugify = function () {
	this.slug = slug(((Math.random() * Math.pow(36, 6)) | 0).toString(36));
};

TollSchema.methods.toJSON = function () {
	return {
		toll: {
			slug: this.slug,
			project: this.project,
			area: this.area,
			trialPrice: this.trialPrice,
			singlePrice: this.singlePrice,
			groupPrice: this.groupPrice,
			yoshinoriPrice: this.yoshinoriPrice,
			status: this.status,
			tutor: this.tutor,
		},
	};
};

module.exports = mongoose.model("Toll", TollSchema);
