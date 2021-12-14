let router = require("express").Router();

let { OkResponse, BadRequestResponse } = require("express-http-response");

const {
	isAdmin,
	isToken,
	isTutor,
	isStudent,
	isAccepted,
	isRejected,
	isPosted,
} = require("../auth");

const AppModel = require("../../models/Application");
const UserModel = require("../../models/User");
const CourseModel = require("../../models/Course");

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

// get Course for every time courseSlug given
router.param("courseSlug", (req, res, next, courseSlug) => {
	CourseModel.findOne({ slug: courseSlug }, (err, course) => {
		if (!err && course !== null) {
			// console.log(course);
			req.course = course;
			return next();
		}
		next(new BadRequestResponse("Course not found!", 423));
		return;
	});
});

// get App for every time appSlug given
router.param("appSlug", (req, res, next, appSlug) => {
	AppModel.findOne({ slug: appSlug }, (err, app) => {
		if (!err && app !== null) {
			// console.log(app);
			req.app = app;
			return next();
		}
		next(new BadRequestResponse("Course not found!", 423));
		return;
	});
});

// General Check
router.get("/app", function (req, res, next) {
	next(new OkResponse({ message: `Apps Api's are working` }));
	return;
});

// Add Application
router.post(
	"/addApp/:email/:courseSlug",
	isToken,
	isStudent,
	(req, res, next) => {
		// console.log(req.user);
		// console.log(req.emailUser);
		// console.log(req.course);
		// console.log("req.course");
		// console.log(req.body);

		const {
			duration,
			projectCat,
			area,
			coursePrice,
			remarks,
			startDate,
			endDate,
			slotStart,
			weekDay,
			status,
			isPosted,
		} = req.body.app;

		// console.log(req.body);
		// console.log(req.body.app);

		// Validate User input
		if (duration === undefined || duration === null) {
			// console.log("ID");
			next(new BadRequestResponse("Missing required parameter", 422));
			return;
		}

		// console.log(req.body.course);
		// Create user in our database
		let newApp = AppModel();

		newApp.duration = duration;

		if (projectCat) {
			newApp.projectCat = projectCat;
		}
		if (area) {
			newApp.area = area;
		}
		if (coursePrice) {
			newApp.coursePrice = coursePrice;
		}
		if (remarks) {
			newApp.remarks = remarks;
		}
		if (startDate) {
			newApp.startDate = startDate;
		}
		if (endDate) {
			newApp.endDate = endDate;
		}
		if (slotStart) {
			newApp.slotStart = slotStart;
		}
		if (weekDay) {
			newApp.weekDay = weekDay;
		}

		newApp.student = req.user._id;
		newApp.tutor = req.emailUser._id;
		newApp.course = req.course._id;

		// console.log(newApp);

		newApp.save((err, result) => {
			if (err) {
				// console.log(err);
				next(new BadRequestResponse(err));
				return;
			} else {
				// console.log(result);
				next(new OkResponse(result.toJSON()));
				return;
			}
		});
	}
);

// View All Apps
router.get("/apps", isToken, (req, res, next) => {
	if (req.user.role === 1 || req.user.role === 3) {
		// console.log("inside");
		const options = {
			page: +req.query.page || 1,
			limit: +req.query.limit || 10,
			populate: "tutor",
			populate: "course",
		};

		let query = {};
		if (req.user.role === 3) {
			query.student = req.user._id;
		}
		AppModel.paginate(query, options, function (err, result) {
			if (err) {
				// console.log(err);
				next(new BadRequestResponse("Server Error"), 500);
				return;
			}
			// console.log(result);
			result.docs = result.docs.map((app) => app.toJSON());
			// console.log(":::Result:::::", result);
			// console.log(":::Result Docs:::::", result.docs);
			next(new OkResponse({ result: result.docs }));
			return;
		}).catch((e) => {
			// console.log(e);
			next(new BadRequestResponse(e.error));
			return;
		});
	}
});

// View Specific App
router.get("/app/:appSlug", isToken, isStudent, (req, res, next) => {
	// console.log(req.app);
	if (req.app) {
		next(new OkResponse(req.app.toJSON()));
		return;
	} else {
		next(new BadRequestResponse("App not found!", 423));
		return;
	}
});

// Update App
router.put("/updateApp/:appSlug", isToken, isStudent, (req, res, next) => {
	// console.log(req.body);
	// console.log(req.app);
	// console.log(req.user);
	if (req.body.app.projectCat) {
		req.app.projectCat = req.body.app.projectCat;
	}
	if (req.body.app.area) {
		req.app.area = req.body.app.area;
	}
	if (req.body.app.coursePrice) {
		req.app.coursePrice = req.body.app.coursePrice;
	}
	if (req.body.app.remarks) {
		req.app.remarks = req.body.app.remarks;
	}
	if (req.body.app.startDate) {
		req.app.startDate = req.body.app.startDate;
	}
	if (req.body.app.endDate) {
		req.app.endDate = req.body.app.endDate;
	}
	if (req.body.app.slotStart) {
		req.app.slotStart = req.body.app.slotStart;
	}
	if (req.body.app.weekDay) {
		req.app.weekDay = req.body.app.weekDay;
	}
	if (req.body.app.duration) {
		req.app.duration = req.body.app.duration;
	}

	// console.log("::::::::app:::::", req.app);

	req.app
		.save()
		.then((app) => {
			next(new OkResponse(app.toJSON()));
			return;
		})
		.catch((err) => {
			next(new BadRequestResponse(err));
			return;
		});
});

// Delete Specific App
router.delete("/delApp/:appSlug", isToken, async (req, res, next) => {
	// console.log("req");
	// console.log(req.user);
	// console.log(req.app);
	// console.log(req.user._id);
	// console.log(req.app.tutor);
	// console.log(req.user.role);
	if (
		req.user._id.toString() === req.app.student._id.toString() ||
		req.user.role === 1
	) {
		// console.log(req.app);
		req.app
			.remove()
			.then((app) => {
				next(new OkResponse(app.toJSON()));
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

// Accept App
router.put(
	"/acceptApp/:email/:appSlug",
	isToken,
	isTutor,
	isAccepted,
	(req, res, next) => {
		// console.log(req.user);

		req.app.status = 1;

		req.app.save((err, result) => {
			if (err) {
				// console.log(err);
				next(new BadRequestResponse(err));
				return;
			} else {
				// console.log(result);
				next(new OkResponse(req.app.toJSON()));
				return;
			}
		});
	}
);

// Reject App
router.put(
	"/rejectApp/:email/:appSlug",
	isToken,
	isTutor,
	isRejected,
	(req, res, next) => {
		// console.log(req.user);
		// console.log(req.emailUser);
		// console.log(req.app);
		// console.log(req.app.tutor.toString());
		// console.log(req.app.student.toString());
		// console.log(req.user._id.toString());
		// console.log(req.emailUser._id.toString());
		if (
			req.app.tutor.toString() === req.user._id.toString() &&
			req.app.student.toString() === req.emailUser._id.toString()
		) {
			console.log("inside");
			req.app.status = 2;

			req.app.save((err, result) => {
				if (err) {
					// console.log(err);
					next(new BadRequestResponse(err));
					return;
				} else {
					// console.log(result);
					next(new OkResponse(req.app.toJSON()));
					return;
				}
			});
		} else {
		}
	}
);

// post App
router.put(
	"/postApp/:appSlug",
	isToken,
	isStudent,
	isPosted,
	(req, res, next) => {
		// console.log(req.user);

		req.app.isPosted = true;

		req.app.save((err, result) => {
			if (err) {
				// console.log(err);
				next(new BadRequestResponse(err));
				return;
			} else {
				// console.log(result);
				next(new OkResponse(req.app.toJSON()));
				return;
			}
		});
	}
);

// View All Posted Apps
router.get("/postedApps", isToken, async (req, res, next) => {
	if (req.user.role === 1 || req.user.role == 3) {
		let query = {};
		query.isPosted = true;

		const options = {
			page: +req.query.page || 1,
			limit: +req.query.limit || 10,
			populate: "tutor",
			populate: "student",
			populate: "course",
		};

		if (req.user.role === 3) {
			query.student = req.user._id;
		}

		AppModel.paginate(query, options, function (err, result) {
			if (err) {
				// console.log(err);
				next(new BadRequestResponse("Server Error"), 500);
				return;
			}
			// console.log(result);
			result.docs = result.docs.map((app) => app.toJSON());
			// console.log(":::Result:::::", result);
			// console.log(":::Result Docs:::::", result.docs);
			next(new OkResponse({ result: result.docs }));
			return;
		}).catch((e) => {
			// console.log(e);
			next(new BadRequestResponse(e.error));
			return;
		});
	} else {
		next(new UnauthorizedResponse("Access Denied"));
		return;
	}
});

// View All unPosted Apps
router.get("/unPostedApps", isToken, async (req, res, next) => {
	if (req.user.role === 1 || req.user.role == 3) {
		let query = {};
		query.isPosted = false;

		const options = {
			page: +req.query.page || 1,
			limit: +req.query.limit || 10,
			populate: "tutor",
			populate: "student",
			populate: "course",
		};

		if (req.user.role === 3) {
			query.tutor = req.user._id;
		}
		AppModel.paginate(query, options, function (err, result) {
			if (err) {
				// console.log(err);
				next(new BadRequestResponse("Server Error"), 500);
				return;
			}
			// console.log(result);
			result.docs = result.docs.map((apps) => apps.toJSON());
			// console.log(":::Result:::::", result);
			// console.log(":::Result Docs:::::", result.docs);
			next(new OkResponse({ result: result.docs }));
			return;
		}).catch((e) => {
			// console.log(e);
			next(new BadRequestResponse(e.error));
			return;
		});
	} else {
		next(new UnauthorizedResponse("Access Denied"));
		return;
	}
});

// View All Accepted Apps
router.get("/acceptedApps", isToken, async (req, res, next) => {
	if (req.user.role === 1 || req.user.role == 2) {
		let query = {};
		query.status = 1;

		const options = {
			page: +req.query.page || 1,
			limit: +req.query.limit || 10,
			populate: "tutor",
			populate: "student",
			populate: "course",
		};

		if (req.user.role === 2) {
			query.tutor = req.user._id;
		}

		AppModel.paginate(query, options, function (err, result) {
			if (err) {
				// console.log(err);
				next(new BadRequestResponse("Server Error"), 500);
				return;
			}
			// console.log(result);
			result.docs = result.docs.map((app) => app.toJSON());
			// console.log(":::Result:::::", result);
			// console.log(":::Result Docs:::::", result.docs);
			next(new OkResponse({ result: result.docs }));
			return;
		}).catch((e) => {
			// console.log(e);
			next(new BadRequestResponse(e.error));
			return;
		});
	} else {
		next(new UnauthorizedResponse("Access Denied"));
		return;
	}
});

// View All Rejected Apps
router.get("/rejectedApps", isToken, async (req, res, next) => {
	if (req.user.role === 1 || req.user.role == 2) {
		let query = {};
		query.status = 2;

		const options = {
			page: +req.query.page || 1,
			limit: +req.query.limit || 10,
			populate: "tutor",
			populate: "student",
			populate: "course",
		};

		if (req.user.role === 2) {
			query.tutor = req.user._id;
		}
		AppModel.paginate(query, options, function (err, result) {
			if (err) {
				// console.log(err);
				next(new BadRequestResponse("Server Error"), 500);
				return;
			}
			// console.log(result);
			result.docs = result.docs.map((apps) => apps.toJSON());
			// console.log(":::Result:::::", result);
			// console.log(":::Result Docs:::::", result.docs);
			next(new OkResponse({ result: result.docs }));
			return;
		}).catch((e) => {
			// console.log(e);
			next(new BadRequestResponse(e.error));
			return;
		});
	} else {
		next(new UnauthorizedResponse("Access Denied"));
		return;
	}
});

// View All Pending Apps
router.get("/pendingApps", isToken, async (req, res, next) => {
	if (req.user.role === 1 || req.user.role == 2 || req.user.role == 3) {
		let query = {};
		query.status = 3;

		const options = {
			page: +req.query.page || 1,
			limit: +req.query.limit || 10,
			populate: "tutor",
			populate: "student",
			populate: "course",
		};

		if (req.user.role === 2) {
			query.tutor = req.user._id;
		} else if (req.user.role === 3) {
			query.student = req.user._id;
		}
		AppModel.paginate(query, options, function (err, result) {
			if (err) {
				// console.log(err);
				next(new BadRequestResponse("Server Error"), 500);
				return;
			}
			// console.log(result);
			result.docs = result.docs.map((apps) => apps.toJSON());
			// console.log(":::Result:::::", result);
			// console.log(":::Result Docs:::::", result.docs);
			next(new OkResponse({ result: result.docs }));
			return;
		}).catch((e) => {
			// console.log(e);
			next(new BadRequestResponse(e.error));
			return;
		});
	} else {
		next(new UnauthorizedResponse("Access Denied"));
		return;
	}
});

module.exports = router;
