let router = require("express").Router();

const passport = require("passport");

let {
	OkResponse,
	BadRequestResponse,
	UnauthorizedResponse,
} = require("express-http-response");

const UserModel = require("../../models/User");

const getToken = require("../../utilities/getToken");

const {
	isAdmin,
	isUnBlocked,
	isBlocked,
	isTutor,
	isStudent,
	isToken,
} = require("../auth");

var emailService = require("../../utilities/emailService");

// Acquiring Passport
const { localStrategy } = require("../../utilities/passport");

// console.log(localStrategy);
passport.use(localStrategy);
router.use(passport.initialize());

// get user for every time mail given
router.param("email", (req, res, next, email) => {
	UserModel.findOne({ email }, (err, user) => {
		if (!err && user !== null) {
			// console.log(user);
			req.emailUser = user;
			return next();
		}
		next(new BadRequestResponse("User not found!", 423));
		return;
	});
});

// General Check
router.get("/", function (req, res, next) {
	next(new OkResponse({ message: `Users Api's are working` }));
	return;
});

// Signup
router.post("/signup", (req, res, next) => {
	const {
		email,
		category,
		nameChinese,
		nameEng,
		phone,
		age,
		gender,
		password,
		profilePic,
		backgroundPic,
		expertise,
		experience,
		fbLink,
		instaLink,
		youtubeLink,
		intro,
		interested,
	} = req.body.user;

	if (expertise || experience || fbLink || instaLink || youtubeLink) {
		if (intro || interested) {
			next(new BadRequestResponse("It can be either student or tutor"));
			return;
		}
		req.role = 2;
	} else if (intro || interested) {
		if (expertise || experience || fbLink || instaLink || youtubeLink) {
			next(new BadRequestResponse("It can be either student or tutor"));
			return;
		}
		req.role = 3;
	} else {
		req.role = 3;
	}
	// console.log(req.body.user);
	// console.log(tutor);
	// console.log(student);
	if (
		email.length === 0 ||
		typeof email === "undefined" ||
		category.length === 0 ||
		typeof category === "undefined" ||
		nameChinese.length === 0 ||
		typeof nameChinese === "undefined" ||
		nameEng.length === 0 ||
		typeof nameEng === "undefined" ||
		age.length === 0 ||
		typeof age === "undefined" ||
		gender.length === 0 ||
		typeof gender === "undefined" ||
		phone.length === 0 ||
		typeof phone === "undefined" ||
		profilePic.length === 0 ||
		typeof profilePic === "undefined" ||
		password.length === 0 ||
		typeof password === "undefined"
	) {
		next(new BadRequestResponse("Missing required parameter", 422));
		return;
	}
	// console.log("before");

	if (req.role === 2) {
		console.log("tutor");
		// console.log(req.body.user);

		// Validate User input
		if (
			expertise === undefined ||
			expertise === null ||
			experience === undefined ||
			experience === null
		) {
			// console.log("ID");
			next(new BadRequestResponse("Missing required parameter", 422));
			return;
		}

		// Create user in our database
		let newUser = UserModel();
		// console.log("else");

		// console.log(newUser);
		newUser.role = 2;

		newUser.email = email;
		newUser.category = category;
		newUser.nameChinese = nameChinese;
		newUser.nameEng = nameEng;
		newUser.phone = phone;
		newUser.age = age;
		newUser.gender = gender;
		newUser.profilePic = profilePic;
		newUser.backgroundPic = backgroundPic;

		// console.log(newUser);

		newUser.setPassword(password);

		// console.log("otp");
		newUser.setOTP();

		// console.log(newUser);

		// console.log("tut");
		// console.log(newUser);

		newUser.expertise = expertise;
		newUser.experience = experience;
		// console.log(newUser);

		if (fbLink) {
			// console.log("fb");
			newUser.fbLink = fbLink;
			// console.log(newUser);
		}

		if (instaLink) {
			// console.log("fb");
			newUser.instaLink = instaLink;
		}

		if (youtubeLink) {
			// console.log("fb");
			newUser.youtubeLink = youtubeLink;
		}
		// console.log(newUser);

		// console.log(newUser);
		newUser.save((err, result) => {
			if (err) {
				// console.log(err);
				next(new BadRequestResponse(err));
				return;
			} else {
				// console.log(result);
				emailService.sendEmailVerificationOTP(result);
				next(
					new OkResponse({
						message:
							"SignUp successfully an OTP sent to your email please verify your email address",
					})
				);
				return;
			}
		});
	} else if (req.role === 3) {
		console.log("Student");

		// Create user in our database
		let newUser = new UserModel();
		newUser.expertise = "null";
		newUser.experience = "null";
		// console.log(newUser.tutor);

		// console.log("else");

		// console.log(newUser);

		newUser.email = email;
		newUser.category = category;
		newUser.nameChinese = nameChinese;
		newUser.nameEng = nameEng;
		newUser.phone = phone;
		newUser.age = age;
		newUser.gender = gender;
		newUser.profilePic = profilePic;
		newUser.backgroundPic = backgroundPic;

		// console.log(newUser);

		newUser.setPassword(password);

		// console.log(newUser);
		newUser.role = 3;
		newUser.setOTP();
		// console.log(newUser);

		if (intro) {
			newUser.intro = intro;
		}

		// console.log(newUser);
		if (interested) {
			newUser.interested = interested;
		}
		console.log(newUser);

		newUser.save((err, result) => {
			if (err) {
				// console.log(err);
				next(new BadRequestResponse(err));
				return;
			} else {
				// console.log(result);
				emailService.sendEmailVerificationOTP(result);
				next(
					new OkResponse({
						message:
							"SignUp successfully an OTP sent to your email please verify your email address",
					})
				);
				return;
			}
		});
	} else {
		// console.log("out");
		next(new BadRequestResponse("You Should be student or tutor"));
		return;
	}
});

// verifyOTP
router.post("/otp/verify", (req, res, next) => {
	if (!(req.body.email && req.body.otp && req.body.type)) {
		next({ err: new BadRequestResponse("Missing required parameter", 422) });
		return;
	}

	let query = {
		email: req.body.email,
		otp: req.body.otp,
		otpExpires: { $gt: Date.now() },
	};
	// console.log(query);
	UserModel.findOne(query, function (err, user) {
		if (err || !user) {
			// console.log(err);
			// console.log(user);
			next({ err: new UnauthorizedResponse("Invalid OTP") }, 401.1);
			return;
		}
		user.otp = null;
		user.otpExpires = null;
		if (req.body.type === 1) {
			user.isEmailVerified = true;
			console.log("user is verified");
		} else {
			user.generatePasswordRestToken();
		}
		user.save().then(function () {
			if (req.body.type === 1) {
				next(new OkResponse({ user: user.toAuthJSON() }));
				return;
			} else if (req.body.type === 2) {
				next(new OkResponse({ passwordRestToken: user.resetPasswordToken }));
				return;
			}
		});
	});
});

// Resend OTP
router.post("/otp/resend/:email", (req, res, next) => {
	req.emailUser.setOTP();
	req.emailUser.save((err, user) => {
		emailService.sendEmailVerificationOTP(req.emailUser);
		next(
			new OkResponse({
				message: "OTP sent Successfully to registered email address",
			})
		);
		return;
	});
});

// Reset Password
router.post("/reset/password/:email", (req, res, next) => {
	// console.log(req.body);
	// console.log(req.emailUser.resetPasswordToken);
	if (req.body.resetPasswordToken !== req.emailUser.resetPasswordToken) {
		next({ err: new UnauthorizedResponse("Invalid Password Reset Token") });
		return;
	}
	req.emailUser.setPassword(req.body.password);
	req.emailUser.resetPasswordToken = null;
	// console.log(req.emailUser);
	req.emailUser.save((err, user) => {
		if (err) {
			next(new BadRequestResponse(err));
			return;
		}
		// console.log(user);
		next(new OkResponse({ user: user.toAuthJSON() }));
		return;
	});
});

// Login
router.post(
	"/login",
	passport.authenticate("local", { session: false }),
	getToken,
	(req, res, next) => {
		// console.log("Login");
		// console.log("User", req.user);
		// console.log("Token", req.user.token);

		next(new OkResponse(req.user.toAuthJSON()));
		return;
	}
);

// User context Api
router.get("/context", isToken, function (req, res, next) {
	let user = req.user;
	next(new OkResponse(user.toAuthJSON()));
});

// Block Specific User
router.put(
	"/block/:email",
	isToken,
	isAdmin,
	isBlocked,
	async (req, res, next) => {
		console.log(req.user);
		req.emailUser.status = 2;
		req.emailUser.token = "";

		req.emailUser.save((err, result) => {
			if (err) {
				// console.log(err);
				next(new BadRequestResponse(err));
				return;
			} else {
				// console.log(result);
				next(new OkResponse(req.emailUser.toJSON()));
				return;
			}
		});
	}
);

// UnBlock Specific User
router.put(
	"/unblock/:email",
	isToken,
	isAdmin,
	isUnBlocked,
	async (req, res, next) => {
		console.log(req.emailUser);
		req.emailUser.status = 1;
		req.emailUser.token = "";

		req.emailUser.save((err, result) => {
			if (err) {
				// console.log(err);
				next(new BadRequestResponse(err));
				return;
			} else {
				// console.log(result);
				next(new OkResponse(req.emailUser.toJSON()));
				return;
			}
		});
	}
);

// View All users
router.get("/users", isToken, isAdmin, (req, res, next) => {
	console.log("Inside");
	const options = {
		page: +req.query.page || 1,
		limit: +req.query.limit || 10,
	};

	let query = {};
	// query.role = 1;

	UserModel.paginate(query, options, function (err, result) {
		if (err) {
			// console.log(err);
			next(new BadRequestResponse("Server Error"), 500);
			return;
		}
		// console.log(result);
		result.docs = result.docs.map((user) => user.toJSON());
		// console.log(":::Result:::::", result);
		// console.log(":::Result Docs:::::", result.docs);
		next(new OkResponse({ result: result.docs }));
		return;
	}).catch((e) => {
		console.log(e);
		next(new BadRequestResponse(e.error));
		return;
	});
});

// View Specific User
router.get("/view/:email", isToken, (req, res, next) => {
	if (req.user.email === req.emailUser.email || req.user.role === 1) {
		UserModel.findOne({ email: req.emailUser.email })
			.then((user) => {
				next(new OkResponse(user.toJSON()));
				return;
			})
			.catch((err) => {
				next(new BadRequestResponse(err));
				return;
			});
	} else {
		next(new UnauthorizedResponse("Access Denied"));
		return;
	}
});

// Update Specific User
router.put("/update/:email", isToken, (req, res, next) => {
	// console.log("Context User:::::::::::::", req.user);
	// console.log("Required::::::::::::::::::::", req.emailUser);
	if (req.user.email === req.emailUser.email || req.user.role === 1) {
		UserModel.findOne({ email: req.emailUser.email })
			.then((updateUser) => {
				// console.log(updateUser);
				console.log(req.body);

				if (req.body.email) {
					updateUser.email = req.body.email;
				}
				if (req.body.category) {
					updateUser.category = req.body.category;
				}
				if (req.body.nameChinese) {
					updateUser.nameChinese = req.body.nameChinese;
				}
				if (req.body.nameEng) {
					updateUser.nameEng = req.body.nameEng;
				}
				if (req.body.phone) {
					updateUser.phone = req.body.phone;
				}
				if (req.body.age) {
					updateUser.age = req.body.age;
				}
				if (req.body.gender) {
					updateUser.gender = req.body.gender;
				}
				if (req.body.profilePic) {
					updateUser.profilePic = req.body.profilePic;
				}
				if (req.body.backgroundPic) {
					updateUser.backgroundPic = req.body.backgroundPic;
				}
				if (req.body.password) {
					updateUser.setPassword(req.body.password);
				}
				if (req.emailUser.role === 2) {
					if (req.body.tutor) {
						if (req.body.tutor.experience) {
							updateUser.tutor.experience = req.body.tutor.experience;
						}
						if (req.body.tutor.expertise) {
							updateUser.tutor.expertise = req.body.tutor.expertise;
						}
						if (req.body.tutor.fbLink) {
							updateUser.tutor.fbLink = req.body.tutor.fbLink;
						}
						if (req.body.tutor.instaLink) {
							updateUser.tutor.instaLink = req.body.tutor.instaLink;
						}
						if (req.body.tutor.youtubeLink) {
							updateUser.tutor.youtubeLink = req.body.tutor.youtubeLink;
						}
					}
				}
				if (req.emailUser.role === 3) {
					if (req.body.student) {
						if (req.body.student.interested) {
							updateUser.student.interested = req.body.student.interested;
						}
						if (req.body.student.intro) {
							updateUser.student.intro = req.body.student.intro;
						}
					}
				}

				// console.log(updateUser);

				updateUser
					.save()
					.then((user) => {
						next(new OkResponse(user.toJSON()));
						return;
					})
					.catch((err) => {
						next(new BadRequestResponse(err));
						return;
					});
			})
			.catch((err) => {
				next(new BadRequestResponse(err));
				return;
			});
	} else {
		next(new UnauthorizedResponse("Access Denied"));
	}
});

// delete Specific User
router.delete("/delUser/:email", isToken, isAdmin, async (req, res, next) => {
	req.emailUser
		.remove()
		.then((user) => {
			next(new OkResponse(user.toJSON()));
			return;
		})
		.catch((err) => {
			next(new BadRequestResponse(err));
			return;
		});
});

// Add Profile Picture
router.post("/addProfilePic", isToken, isTutor, (req, res, next) => {
	// console.log(req.user);
	console.log(req.body);
	const NewPics = req.body.pics;
	if (NewPics.length === 0) {
		next(new BadRequestResponse("Missing required parameter", 422));
		return;
	}

	req.user.profilePic = req.user.profilePic.concat(NewPics);
	req.user
		.save()
		.then((result) => {
			next(new OkResponse(result));
			return;
		})
		.catch((err) => {
			next(new BadRequestResponse(err));
			return;
		});
});

// View All Profile Pics
router.get("/profilePics", isToken, isTutor, (req, res, next) => {
	const options = {
		page: +req.query.page || 1,
		limit: +req.query.limit || 10,
	};

	let query = {};
	query.email = req.user.email;
	// console.log(query);

	UserModel.paginate(query, options, function (err, result) {
		if (err) {
			// console.log(err);
			next(new BadRequestResponse("Server Error"), 500);
			return;
		}
		// console.log(result);
		result.docs = result.docs.map((pics) => pics.toJSON());
		let data = result.docs;
		// console.log(data);
		// console.log(":::Result:::::", data[0].user.profilePic);
		// console.log(":::Result Docs:::::", result.docs);
		next(new OkResponse({ pics: data[0].user.profilePic }));
		return;
	}).catch((e) => {
		// console.log(e);
		next(new BadRequestResponse(e.error));
		return;
	});
});

// Remove Profile Pics
router.put("/removeProfilePic", isToken, isTutor, (req, res, next) => {
	let pics = req.user.profilePic;
	// console.log(req.query.category);
	// console.log(categories);
	const index = pics.indexOf(req.query.pic);
	if (index === -1) {
		next(new BadRequestResponse("No Pic Found"));
		return;
	}
	// console.log("::::::::::index:::::::::", index);
	// console.log(categories);
	pics.splice(index, 1);
	// console.log(categories);
	req.user
		.save()
		.then((result) => {
			next(new OkResponse(result));
			return;
		})
		.catch((err) => {
			next(new BadRequestResponse(err));
			return;
		});
});

// ::::::::::::Searching::::::::::::::::::::

// Search Mentors
router.get("/searchCoach", (req, res, next) => {
	// console.log(req.query.tutor);
	const options = {
		page: +req.query.page || 1,
		limit: +req.query.limit || 10,
	};

	let query = {};
	query.role = 2;

	if (req.query.area) {
		let data = JSON.parse(req.query.area).toString();
		// console.log("data", data);
		let arr = data.split(",");
		// console.log("Arr", arr);
		query.area = {
			$all: arr,
		};
	}
	if (req.query.gender) {
		// console.log(req.query.gender.length);
		if (req.query.gender.length > 1) {
			next(new BadRequestResponse("You can't send 2 categories at a time"));
			return;
		}
		query.gender = req.query.gender;
	}
	if (req.query.price) {
		query.price = req.query.price;
	}
	if (req.query.category) {
		// console.log("reQ", JSON.parse(req.query.category));
		let data = JSON.parse(req.query.category).toString();
		// console.log("data", data);
		let arr = data.split(",");
		// console.log("Arr", arr);

		query.category = {
			$all: arr,
		};
	}
	// console.log(query);

	UserModel.paginate(query, options, function (err, result) {
		if (err) {
			// console.log(err);
			next(new BadRequestResponse("Server Error"), 500);
			return;
		}
		// console.log(result);
		result.docs = result.docs.map((user) => user.toJSON());
		// console.log(result.docs);
		// console.log(":::Result:::::", data[0].user.profilePic);
		// console.log(":::Result Docs:::::", result.docs);
		next(new OkResponse({ result: result.docs }));
		return;
	}).catch((e) => {
		console.log("e");
		next(new BadRequestResponse(e.error));
		return;
	});
});

module.exports = router;
