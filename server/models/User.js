let mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
let crypto = require("crypto");
let jwt = require("jsonwebtoken");
var otpGenerator = require("otp-generator");
let secret = require("../config").secret;
const mongoosePaginate = require("mongoose-paginate-v2");

let UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			lowercase: true,
			required: true,
			trim: true,
			index: true,
			unique: true,
			sparse: true,
		},
		category: { type: [String], default: null },
		nameChinese: {
			type: String,
			required: true,
			minLength: 3,
			default: null,
			trim: true,
		},
		nameEng: {
			type: String,
			required: true,
			minLength: 3,
			default: null,
			trim: true,
		},
		age: { type: Number, required: true, min: 0, max: 150 },
		gender: {
			type: Number,
			required: true,
			enum: [
				1, // 1: male
				2, // 2: female
				3, // 3: Not Sure
			],
		},
		phone: {
			type: Number,
			required: true,
			default: null,
			minLength: 8,
		},
		profilePic: { type: Array, required: true },
		backgroundPic: { type: String, default: null },

		area: { type: String, trim: true },
		price: { type: Number, default: null },

		expertise: {
			type: String,
			required: true,
			default: null,
		},
		experience: {
			type: String,
			default: null,
			required: true,
		},
		fbLink: { type: String, trim: true },
		instaLink: { type: String, trim: true },
		youtubeLink: { type: String, trim: true },
		intro: { type: String, trim: true },
		interested: { type: String, trim: true },

		isEmailVerified: { type: Boolean, default: false },
		otp: { type: String, default: null },
		otpExpires: { type: Date, default: null },
		isOtpVerified: { type: Boolean, default: false },
		resetPasswordToken: { type: String, default: null },

		role: {
			type: Number,
			default: 1, // default 1- User
			enum: [
				1, // 1: Admin
				2, // 2: Tutor
				3, // 3: Student
			],
		},

		status: {
			type: Number,
			default: 1,
			enum: [
				1, //Active
				2, //Blocked
			],
		},
		hash: String,
		salt: String,
	},
	{ timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });
UserSchema.plugin(mongoosePaginate);

UserSchema.methods.validPassword = function (password) {
	let hash = crypto
		.pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
		.toString("hex");
	return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString("hex");
	this.hash = crypto
		.pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
		.toString("hex");
};

UserSchema.methods.setOTP = function () {
	this.otp = otpGenerator.generate(4, {
		lowerCaseAlphabets: false,
		upperCaseAlphabets: false,
		// alphabets: false,
		// upperCase: false,
		specialChars: false,
	});
	this.otpExpires = Date.now() + 3600000; // 1 hour
};

UserSchema.methods.generatePasswordRestToken = function () {
	this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
};

UserSchema.methods.generateJWT = function () {
	// let today = new Date();
	// let exp = new Date(today);
	// exp.setDate(today.getDate() + 60);

	return jwt.sign(
		{
			id: this._id,
			email: this.email,
			// exp: parseInt(exp.getTime() / 1000),
		},
		secret,
		{ expiresIn: "60d" }
	);
};
UserSchema.methods.toJSON = function () {
	return {
		user: {
			email: this.email,
			category: this.category,
			nameEng: this.nameEng,
			nameChinese: this.nameChinese,
			age: this.age,
			gender: this.gender,
			phone: this.phone,
			profilePic: this.profilePic,
			backgroundPic: this.backgroundPic,
			tutor: this.tutor,
			student: this.student,
		},
	};
};

UserSchema.methods.toAuthJSON = function () {
	return {
		user: {
			email: this.email,
			category: this.category,
			nameEng: this.nameEng,
			nameChinese: this.nameChinese,
			age: this.age,
			gender: this.gender,
			phone: this.phone,
			profilePic: this.profilePic,
			backgroundPic: this.backgroundPic,
			tutor: this.tutor,
			token: this.generateJWT(),
		},
	};
};

module.exports = mongoose.model("User", UserSchema);
