let router = require("express").Router();

const passport = require("passport");

let {
	OkResponse,
	BadRequestResponse,
	UnauthorizedResponse,
} = require("express-http-response");

const UserModel = require("../../models/User");
const BedModel = require("../../models/Bed");

const {
	isAdmin,
	isUnBlocked,
	isBlocked,
	isToken,
} = require("../auth");

var emailService = require("../../utilities/emailService");

// Acquiring Passport
const {
	localStrategy
} = require("../../utilities/passport");

// console.log(localStrategy);
passport.use(localStrategy);
router.use(passport.initialize());

// get user for every time mail given
router.param("email", (req, res, next, email) => {
	UserModel.findOne({
		email
	}, (err, user) => {
		if (!err && user !== null) {
			// console.log(user);
			req.emailUser = user;
			return next();
		}
		return next(new BadRequestResponse("User not found!", 423));
	});
});

// General Check
router.get("/", function (req, res, next) {
	return next(new OkResponse({
		message: `Users Api's are working`
	}));
});

router.post("/add", isToken, isAdmin, (req, res, next) => {

	// console.log(req.user);
	if (!req.body.user || !req.body.user.email || !req.body.user.firstName || !req.body.user.lastName) {
		return next(new BadRequestResponse("Missing Required parameters"));
	} else if (
		req.body.user.email.length === 0 ||
		req.body.user.firstName.length === 0 ||
		req.body.user.lastName.length === 0
	) {
		return next(new BadRequestResponse("Missing Required parameters"));

	}

	if (
		(req.body.user.allocatedBedNum || req.body.user.noOfStayDays) && (req.body.user.workingDuration || req.body.user.jobDescription)
	) {
		return next(new BadRequestResponse("You Can't a customer and Staff at a time"));
	} else if (req.body.user.allocatedBedNum || req.body.user.noOfStayDays) {
		console.log("3");
		req.role = 3;
	} else if (req.body.user.workingDuration || req.body.user.jobDescription) {
		console.log("2");
		req.role = 2;
	}
	// Create user in our database
	let newUser = UserModel();

	newUser.email = req.body.user.email;
	newUser.firstName = req.body.user.firstName;
	newUser.lastName = req.body.user.lastName;
	newUser.role = req.role;
	newUser.isEmailVerified = true;

	if (req.role === 2) {
		// for Staff
		if (req.body.user.jobDescription) {
			newUser.jobDescription = req.body.user.jobDescription;
		}
		if (req.body.user.workingDuration) {
			newUser.workingDuration = req.body.user.workingDuration;
		}
	}

	// console.log(newUser);
	if (req.role === 3) {
		// for Customer
		if (req.body.user.noOfStayDays) {
			newUser.noOfStayDays = req.body.user.noOfStayDays;
		}
		if (req.body.user.allocatedBedNum) {
			BedModel.findOne({
				bedNum: req.body.user.allocatedBedNum
			}).then((bed) => {
				console.log("Bed::::", bed);
				bed.isFree = false;
				bed.allocatedTo = newUser._id;
				newUser.allocatedBedNum = bed.bedNum;
				bed.save((err, result) => {
					if (err) return next(new BadRequestResponse(err));
					console.log("Status Changed");
				})
			}).catch(() => {
				return next(new BadRequestResponse("No Bed Found"));
			})

		}
	}

	// console.log(newUser);
	newUser.save((err, result) => {
		if (err) {
			// console.log(err);
			return next(new BadRequestResponse(err));
		} else {
			// console.log(result);
			return next(new OkResponse(result));
		}
	});
});

// Login
router.post(
	"/login",
	passport.authenticate("local", {
		session: false
	}),
	(req, res, next) => {
		if (!req.user) {
			next(new BadRequestResponse("No User Found"));
		}
		if (req.user.isBlock === true || req.user.isEmailVerified === false) {
			return next(
				new UnauthorizedResponse(
					"Your Account is Blocked! OR Not Verified!, Contact to Support please ",
					401.1
				)
			);
		}

		return next(new OkResponse(req.user.toAuthJSON()));;
	}
);

// User context Api
router.get("/context", isToken, (req, res, next) => {
	let user = req.user;
	next(new OkResponse(user.toAuthJSON()));
});

router.put("/addServices/:email", isToken, isAdmin, (req, res, next) => {
	if (req.body.meal) {
		req.emailUser.meal = req.body.meal;
	}
	if (req.body.clothe) {
		req.emailUser.clothe = req.body.clothe;
	}
	if (req.body.gym) {
		req.emailUser.gym = req.body.gym;
	}

	req.emailUser.save((err, user) => {
		if (err) return next(new BadRequestResponse(err));
		return next(new OkResponse({
			user
		}));
	})
})

// View All users
router.get("/all", isToken, isAdmin, (req, res, next) => {
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
		next(new OkResponse({
			result: result.docs
		}));
		return;
	}).catch((e) => {
		console.log(e);
		next(new BadRequestResponse(e.error));
		return;
	});
});

// View Specific User
router.get("/:email", isToken, (req, res, next) => {
	if (req.user.email === req.emailUser.email || req.user.role === 1) {
		UserModel.findOne({
				email: req.emailUser.email
			})
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
		UserModel.findOne({
				email: req.emailUser.email
			})
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

module.exports = router;