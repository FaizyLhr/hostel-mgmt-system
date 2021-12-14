const mongoose = require("mongoose");
const slug = require("slug");
const mongoosePaginate = require("mongoose-paginate-v2");
const uniqueValidator = require("mongoose-unique-validator");
const AppSchema = new mongoose.Schema(
	{
		slug: { type: String, unique: true, required: true, trim: true },
		projectCat: { type: Array, default: null },
		area: { type: Array, trim: true },
		coursePrice: { type: Array, trim: true },
		remarks: { type: String, trim: true, default: null },
		startDate: {
			type: Date,
			default: null,
		},
		endDate: {
			type: Date,
			default: null,
		},
		slotStart: {
			type: Date,
			default: null,
		},
		duration: {
			type: Number,
			required: true,
			enum: [
				1, // 1: 1 Hour
				2, // 2: 2 Hour
			],
		},
		weekDay: {
			type: Number,
			enum: [
				0, // 0: Monday
				1, // 1: Tuesday
				2, // 2: Wednesday
				3, // 3: Thursday
				4, // 4: Friday
				5, // 5: Saturday
				6, // 6: Sunday
			],
			default: 0,
		},
		status: {
			type: Number,
			enum: [
				1, // 1: Accepted
				2, // 2: Rejected
				3, // 3: Pending
			],
			default: 3,
		},
		isPosted: { type: Boolean, default: false },
		isPaid: { type: Boolean, default: false },
		course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
		tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);
AppSchema.pre("validate", function (next) {
	if (!this.slug) {
		this.slugify();
	}
	next();
});
AppSchema.plugin(mongoosePaginate);
AppSchema.plugin(uniqueValidator, { message: "is already taken." });

AppSchema.methods.slugify = function () {
	this.slug = slug(((Math.random() * Math.pow(36, 6)) | 0).toString(36));
};

AppSchema.methods.toJSON = function () {
	return {
		App: {
			slug: this.slug,
			projectCat: this.projectCat,
			area: this.area,
			coursePrice: this.coursePrice,
			duration: this.duration,
			remarks: this.remarks,
			startDate: this.startDate,
			endDate: this.endDate,
			slotStart: this.slotStart,
			weekDay: this.weekDay,
			student: this.student,
			tutor: this.tutor,
			course: this.course,
		},
	};
};

module.exports = mongoose.model("Application", AppSchema);
