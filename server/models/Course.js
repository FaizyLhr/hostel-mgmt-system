const mongoose = require("mongoose");
const slug = require("slug");
const mongoosePaginate = require("mongoose-paginate-v2");
const uniqueValidator = require("mongoose-unique-validator");

const CourseSchema = new mongoose.Schema(
	{
		slug: { type: String, unique: true, required: true, trim: true },
		nameChinese: { type: String, default: null, required: true, trim: true },
		nameEng: { type: String, default: null, required: true, trim: true },
		desc: { type: String, default: null, required: true, trim: true },
		pic: { type: String, default: null, required: true, trim: true },
		originalPrice: { type: Number, default: null },
		preferentialPrice: { type: Number, default: null },
		remarks: { type: String, trim: true, default: null },
		isDone: { type: Boolean, default: false },
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

		students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

CourseSchema.pre("validate", function (next) {
	if (!this.slug) {
		this.slugify();
	}
	next();
});

CourseSchema.plugin(mongoosePaginate);
CourseSchema.plugin(uniqueValidator, { message: "is already taken." });

CourseSchema.methods.slugify = function () {
	this.slug = slug(((Math.random() * Math.pow(36, 6)) | 0).toString(36));
};

CourseSchema.methods.toJSON = function () {
	return {
		course: {
			slug: this.slug,
			nameChinese: this.nameChinese,
			nameEng: this.nameEng,
			desc: this.desc,
			pic: this.pic,
			duration: this.duration,
			remarks: this.remarks,
			startDate: this.startDate,
			endDate: this.endDate,
			originalPrice: this.originalPrice,
			preferentialPrice: this.preferentialPrice,
			slotStart: this.slotStart,
			weekDay: this.weekDay,
			tutor: this.tutor,
		},
	};
};

module.exports = mongoose.model("Course", CourseSchema);
