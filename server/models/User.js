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

		firstName: {
			type: String,
			required: true,
			minLength: 3,
			default: null,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			minLength: 3,
			default: null,
			trim: true,
		},

		// Staff
		jobDescription: {
			type: String,
			default: null,
		},
		workingDuration: {
			type: Number,
			default: 0,
			enum: [
				0, // 0: nill
				1, // 1: 1-3 months
				2, // 2: 3-6 months
				3, // 3: 6-9 months
				4, // 4: 9-12 months
				5, // 5: above 12 months
			],
		},

		// Customer
		noOfStayDays: {
			type: Number,
			default: 0,
		},
		allocatedBedNum: {
			type: Number,
			default: 0,
		},
		gym: {
			type: Boolean,
			default: false,
		},
		meal: {
			type: Number,
			default: 0,
			enum: [
				0, // 0: nill
				1, // 1:
				2, // 2:
				3, // 3:
				4, // 4:
				5, // 5:
			],
		},
		clothe: {
			type: Number,
			default: 0,
			enum: [
				0, // 0: nill
				1, // 1:
				2, // 2:
				3, // 3:
				4, // 4:
				5, // 5:
			],
		},

		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		otp: {
			type: String,
			default: null,
		},
		otpExpires: {
			type: Date,
			default: null,
		},
		isOtpVerified: {
			type: Boolean,
			default: false,
		},
		resetPasswordToken: {
			type: String,
			default: null,
		},

		role: {
			type: Number,
			default: 3, // default 1- User
			enum: [
				1, // 1: Admin
				2, // 2: Staff
				3, // 3: Customer
			],
		},

		isBlock: {
			type: Boolean,
			default: false,
		},

		hash: String,
		salt: String,
	},
	{
		timestamps: true,
	}
);

UserSchema.plugin(uniqueValidator, {
	message: "is already taken.",
});
UserSchema.plugin(mongoosePaginate);

UserSchema.methods.validPassword = function (password) {
	let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
	return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString("hex");
	this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
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
		{
			expiresIn: "60d",
		}
	);
};

UserSchema.methods.toJSON = function () {
	return {
		email: this.email,
		firstName: this.firstName,
		lastName: this.lastName,
		role: this.role,
		jobDescription: this.jobDescription,
		workingDuration: this.workingDuration,
		noOfStayDays: this.noOfStayDays,
		allocatedBedNum: this.allocatedBedNum,
		gym: this.gym,
		meal: this.meal,
		clothe: this.clothe,
	};
};

UserSchema.methods.toAuthJSON = function () {
	return {
		email: this.email,
		firstName: this.firstName,
		lastName: this.lastName,
		role: this.role,
		jobDescription: this.jobDescription,
		workingDuration: this.workingDuration,
		noOfStayDays: this.noOfStayDays,
		allocatedBedNum: this.allocatedBedNum,
		gym: this.gym,
		meal: this.meal,
		clothe: this.clothe,
		token: this.generateJWT(),
	};
};

module.exports = mongoose.model("User", UserSchema);
