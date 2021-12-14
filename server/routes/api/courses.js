let router = require("express").Router();

const CourseModel = require("../../models/Course");

let {
	OkResponse,
	BadRequestResponse,
	UnauthorizedResponse,
} = require("express-http-response");

const { isAdmin, isTutor, isStudent, isPaid, isToken } = require("../auth");

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
router.get("/course", function (req, res, next) {
	next(new OkResponse({ message: `Courses Api's are working` }));
	return;
});

// Add Course
router.post("/addCourse", isToken, isTutor, (req, res, next) => {
	// console.log(req.user);
	const {
		nameChinese,
		nameEng,
		desc,
		pic,
		duration,
		remarks,
		startDate,
		endDate,
		originalPrice,
		preferentialPrice,
		slotStart,
		weekDay,
	} = req.body.course;

	// console.log(req.body.course);

	// Validate User input
	if (
		nameChinese === undefined ||
		nameChinese === null ||
		nameEng === undefined ||
		nameEng === null ||
		desc === undefined ||
		desc === null ||
		pic === undefined ||
		pic === null
	) {
		// console.log("ID");
		next(new BadRequestResponse("Missing required parameter", 422));
		return;
	}

	// console.log(req.body.course);
	// Create user in our database
	let newCourse = CourseModel();

	if (req.body.course.nameChinese) {
		newCourse.nameChinese = nameChinese;
	}
	if (req.body.course.nameEng) {
		newCourse.nameEng = nameEng;
	}
	if (req.body.course.desc) {
		newCourse.desc = desc;
	}
	if (req.body.course.pic) {
		newCourse.pic = pic;
	}
	if (req.body.course.remarks) {
		newCourse.remarks = remarks;
	}
	if (req.body.course.startDate) {
		newCourse.startDate = startDate;
	}
	if (req.body.course.endDate) {
		newCourse.endDate = endDate;
	}
	if (req.body.course.originalPrice) {
		newCourse.originalPrice = originalPrice;
	}
	if (req.body.course.preferentialPrice) {
		newCourse.preferentialPrice = preferentialPrice;
	}
	if (req.body.course.slotStart) {
		newCourse.slotStart = slotStart;
	}
	if (req.body.course.weekDay) {
		newCourse.weekDay = weekDay;
	}
	if (req.body.course.duration) {
		newCourse.duration = duration;
	}
	newCourse.tutor = req.user._id;

	// console.log(newCourse);

	newCourse.save((err, result) => {
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
});

// Update Course
router.put("/updateCourse/:courseSlug", isToken, isTutor, (req, res, next) => {
	// console.log(req.body);
	// console.log(req.course);
	// console.log(req.user);
	if (req.body.course.nameChinese) {
		req.course.nameChinese = req.body.course.nameChinese;
	}
	if (req.body.course.nameEng) {
		req.course.nameEng = req.body.course.nameEng;
	}
	if (req.body.course.desc) {
		req.course.desc = req.body.course.desc;
	}
	if (req.body.course.pic) {
		req.course.pic = req.body.course.pic;
	}
	if (req.body.course.remarks) {
		req.course.remarks = req.body.course.remarks;
	}
	if (req.body.course.startDate) {
		req.course.startDate = req.body.course.startDate;
	}
	if (req.body.course.endDate) {
		req.course.endDate = req.body.course.endDate;
	}
	if (req.body.course.originalPrice) {
		req.course.originalPrice = req.body.course.originalPrice;
	}
	if (req.body.course.preferentialPrice) {
		req.course.preferentialPrice = req.body.course.preferentialPrice;
	}
	if (req.body.course.slotStart) {
		req.course.slotStart = req.body.course.slotStart;
	}
	if (req.body.course.weekDay) {
		req.course.weekDay = req.body.course.weekDay;
	}
	if (req.body.course.duration) {
		req.course.duration = req.body.course.duration;
	}

	// console.log("::::::::Course:::::", req.course);

	req.course
		.save()
		.then((course) => {
			next(new OkResponse(course.toJSON()));
			return;
		})
		.catch((err) => {
			next(new BadRequestResponse(err));
			return;
		});
});

// View All Courses
router.get("/courses", isToken, isAdmin, (req, res, next) => {
	const options = {
		page: +req.query.page || 1,
		limit: +req.query.limit || 10,
		populate: "tutor",
	};

	let query = {};

	CourseModel.paginate(query, options, function (err, result) {
		if (err) {
			// console.log(err);
			next(new BadRequestResponse("Server Error"), 500);
			return;
		}
		// console.log(result);
		result.docs = result.docs.map((course) => course.toJSON());
		// console.log(":::Result:::::", result);
		// console.log(":::Result Docs:::::", result.docs);
		next(new OkResponse({ result: result.docs }));
		return;
	}).catch((e) => {
		// console.log(e);
		next(new BadRequestResponse(e.error));
		return;
	});
});

// View All Tutor Courses
router.get("/tutorCourses", isToken, async (req, res, next) => {
	// console.log(req.user._id);
	const options = {
		page: +req.query.page || 1,
		limit: +req.query.limit || 10,
		populate: "tutor",
	};

	let query = {};
	query.tutor = req.user._id;
	// console.log(query);

	CourseModel.paginate(query, options, function (err, result) {
		if (err) {
			// console.log(err);
			next(new BadRequestResponse("Server Error"), 500);
			return;
		}
		// console.log(result);
		result.docs = result.docs.map((course) => course.toJSON());
		// console.log(":::Result:::::", result);
		// console.log(":::Result Docs:::::", result.docs);
		next(new OkResponse({ result: result.docs }));
		return;
	}).catch((e) => {
		// console.log(e);
		next(new BadRequestResponse(e.error));
		return;
	});
});

// View Specific Course
router.get("/course/:courseSlug", isToken, isTutor, (req, res, next) => {
	if (req.course) {
		next(new OkResponse(req.course.toJSON()));
		return;
	} else {
		next(new BadRequestResponse("Course not found!", 423));
		return;
	}
});

// Delete Specific Course
router.delete("/delCourse/:courseSlug", isToken, async (req, res, next) => {
	// console.log("req");
	// console.log(req.user);
	// console.log(req.Course);
	// console.log(req.user._id);
	// console.log(req.Course.tutor);
	// console.log(req.user.role);
	if (
		req.user._id.toString() === req.course.tutor._id.toString() ||
		req.user.role === 1
	) {
		// console.log(req.course);
		req.course
			.remove()
			.then((course) => {
				next(new OkResponse(course.toJSON()));
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

// Update status Bit to done
router.put(
	"/doneCourse/:courseSlug",
	isToken,
	isStudent,
	isPaid,
	(req, res, next) => {
		req.course.isDone = true;
		req.course
			.save()
			.then((course) => {
				next(new OkResponse(course.toJSON()));
				return;
			})
			.catch((err) => {
				next(new BadRequestResponse(err));
				return;
			});
	}
);

// View All Paid Courses
router.get("/paidCourses", isToken, async (req, res, next) => {
	if (req.user.role === 1 || req.user.role === 2 || req.user.role == 3) {
		let query = {};
		query.isDone = true;

		const options = {
			page: +req.query.page || 1,
			limit: +req.query.limit || 10,
			populate: "tutor",
		};

		if (req.user.role === 2) {
			query.tutor = req.user._id;
		} else if (req.user.role === 3) {
			query.students = { $all: ["req.user._id"] };
		}
		CourseModel.paginate(query, options, function (err, result) {
			if (err) {
				// console.log(err);
				next(new BadRequestResponse("Server Error"), 500);
				return;
			}
			// console.log(result);
			result.docs = result.docs.map((course) => course.toJSON());
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

// View All unPaid Courses
router.get("/unPaidCourses", isToken, async (req, res, next) => {
	if (req.user.role === 1 || req.user.role === 2 || req.user.role == 3) {
		let query = {};
		query.isDone = false;

		const options = {
			page: +req.query.page || 1,
			limit: +req.query.limit || 10,
			populate: "tutor",
		};

		if (req.user.role === 2) {
			query.tutor = req.user._id;
		} else if (req.user.role === 3) {
			query.students = { $all: ["req.user._id"] };
		}
		CourseModel.paginate(query, options, function (err, result) {
			if (err) {
				// console.log(err);
				next(new BadRequestResponse("Server Error"), 500);
				return;
			}
			// console.log(result);
			result.docs = result.docs.map((course) => course.toJSON());
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

// Search Courses
router.get("/searchCourses", (req, res, next) => {
	// console.log(req.query);
	const options = {
		page: +req.query.page || 1,
		limit: +req.query.limit || 10,
	};

	let query = {};

	if (req.query.nameEng) {
		query.nameEng = req.query.nameEng;
	}
	if (req.query.originalPrice) {
		query.originalPrice = +req.query.originalPrice;
	}
	if (req.query.slotStart) {
		query.slotStart = req.query.slotStart;
	}
	if (req.query.startDate) {
		query.startDate = { $gte: req.query.startDate };
	}
	if (req.query.endDate) {
		query.endDate = { $gte: req.query.endDate };
	}
	if (req.query.duration) {
		query.duration = +req.query.duration;
	}
	if (req.query.weekDay) {
		query.weekDay = +req.query.weekDay;
	}

	console.log(query);

	CourseModel.paginate(query, options, function (err, result) {
		if (err) {
			// console.log(err);
			next(new BadRequestResponse("Server Error"), 500);
			return;
		}
		// console.log(result);
		result.docs = result.docs.map((courses) => courses.toJSON());
		// console.log(data);
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
