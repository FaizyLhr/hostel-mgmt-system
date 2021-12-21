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

router.post("/addStaff", isToken, isAdmin, (req, res, next) => {
	console.log(req.body);
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
	// Create user in our database
	let newUser = UserModel();
	newUser.email = req.body.user.email;
	newUser.firstName = req.body.user.firstName;
	newUser.lastName = req.body.user.lastName;
	newUser.role = 2;
	newUser.isEmailVerified = true;
	// for Staff
	if (req.body.user.jobDescription) {
		newUser.jobDescription = req.body.user.jobDescription;
	}
	if (req.body.user.workingDuration !== 0) {
		newUser.workingDuration = req.body.user.workingDuration;
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
})

router.post("/addCustomer", isToken, isAdmin, (req, res, next) => {
	console.log(req.body);
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
	// Create user in our database
	let newUser = UserModel();
	newUser.email = req.body.user.email;
	newUser.firstName = req.body.user.firstName;
	newUser.lastName = req.body.user.lastName;
	newUser.role = 3;
	newUser.isEmailVerified = true;
	// for Customer
	console.log(req.body);
	if (req.body.user.noOfStayDays !== 0) {
		newUser.noOfStayDays = req.body.user.noOfStayDays;
	}
	if (req.body.user.allocatedBedNum) {
		newUser.save().then((result) => {
			BedModel.findOne({
				bedNum: req.body.user.allocatedBedNum
			}).then((bed) => {
				if (bed.isFree === false) {
					return next(new BadRequestResponse("Bed Already Reserved"));
				}
				// console.log("Bed::::", bed);
				bed.isFree = false;
				bed.allocatedTo = newUser._id;
				newUser.allocatedBedNum = bed.bedNum;

				bed.save((err, result) => {
					if (err) return next(new BadRequestResponse(err));
					console.log("Status Changed");
				})
				// console.log(newUser);
				return next(new OkResponse(result));

			}).catch(() => {
				return next(new BadRequestResponse("No Bed Found"));
			})
		}).catch((err) => {
			return next(new BadRequestResponse(err));
		});
	}

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
	// console.log(req.body)
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

// View All staff
router.get("/home/get/staff", isToken, isAdmin, (req, res, next) => {
	// console.log("Inside");
	const options = {
		page: +req.query.page || 1,
		limit: +req.query.limit || 20,
	};

	let query = {};
	query.role = 2;
	// UserModel.find().then((result) => {
	// 	console.log(result)
	// 	next(new OkResponse({
	// 		result: result
	// 	}));
	// 	return;
	// }).catch((e) => {
	// 	return next(new BadRequestResponse(e));

	// })

	UserModel.paginate(query, options, function (err, result) {
		if (err) {
			// console.log(err);
			return next(new BadRequestResponse("Server Error"), 500);;
		}
		// console.log(result);
		// console.log(":::Result:::::", result);
		// console.log(":::Result Docs:::::", result.docs);
		return next(new OkResponse({
			result: result.docs
		}));;
	}).catch((e) => {
		console.log(e);
		return next(new BadRequestResponse(e.error));
	});
});
// View All customers
router.get("/home/get/customer", isToken, isAdmin, (req, res, next) => {
	// console.log("Inside");
	const options = {
		page: +req.query.page || 1,
		limit: +req.query.limit || 20,
	};

	let query = {};
	query.role = 3;
	// UserModel.find().then((result) => {
	// 	console.log(result)
	// 	next(new OkResponse({
	// 		result: result
	// 	}));
	// 	return;
	// }).catch((e) => {
	// 	return next(new BadRequestResponse(e));

	// })

	UserModel.paginate(query, options, function (err, result) {
		if (err) {
			// console.log(err);
			return next(new BadRequestResponse("Server Error"), 500);;
		}
		// console.log(result);
		// console.log(":::Result:::::", result);
		// console.log(":::Result Docs:::::", result.docs);
		return next(new OkResponse({
			result: result.docs
		}));;
	}).catch((e) => {
		console.log(e);
		return next(new BadRequestResponse(e.error));
	});
});

// View Specific User
router.get("/get/:email", isToken, (req, res, next) => {
	UserModel.findOne({
			email: req.emailUser.email
		})
		.then((user) => {
			return next(new OkResponse(user));;
		})
		.catch((err) => {
			return next(new BadRequestResponse(err));
		});

});

// Update Specific User
router.put("/home/edit/:email", isToken, (req, res, next) => {
	// console.log("Context User:::::::::::::", req.user);
	// console.log("Required::::::::::::::::::::", req.emailUser);
	UserModel.findOne({
			email: req.emailUser.email
		})
		.then((updateUser) => {
			// console.log(updateUser);
			console.log(req.body);
			if (req.emailUser.role === 2) {
				if (req.body.student.interested) {
					updateUser.student.interested = req.body.student.interested;
				}
				if (req.body.student.intro) {
					updateUser.student.intro = req.body.student.intro;
				}
			}
			if (req.emailUser.role === 3) {
				if (req.body.student.interested) {
					updateUser.student.interested = req.body.student.interested;
				}
				if (req.body.student.intro) {
					updateUser.student.intro = req.body.student.intro;
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