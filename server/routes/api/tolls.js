let router = require("express").Router();

const TollModel = require("../../models/Toll");

let {
	OkResponse,
	BadRequestResponse,
	UnauthorizedResponse,
} = require("express-http-response");

const { isAdmin, isTutor, isStudent, isPaid, isToken } = require("../auth");

// get toll for every time tollSlug given
router.param("tollSlug", (req, res, next, tollSlug) => {
	TollModel.findOne({ slug: tollSlug }, (err, toll) => {
		if (!err && toll !== null) {
			// console.log(toll);
			req.toll = toll;
			return next();
		}
		next(new BadRequestResponse("Toll not found!", 423));
		return;
	});
});

// General Check
router.get("/toll", function (req, res, next) {
	next(new OkResponse({ message: `Tolls Api's are working` }));
	return;
});

// Add Toll
router.post("/addToll", isToken, isTutor, (req, res, next) => {
	const { project, area, trialPrice, singlePrice, groupPrice, yoshinoriPrice } =
		req.body.toll;

	// console.log(req.body.toll);

	// Validate User input
	if (
		project === undefined ||
		project === null ||
		area === undefined ||
		area === null ||
		trialPrice === undefined ||
		trialPrice === null ||
		singlePrice === undefined ||
		singlePrice === null ||
		groupPrice === undefined ||
		groupPrice === null ||
		yoshinoriPrice === undefined ||
		yoshinoriPrice === null
	) {
		// console.log("ID");
		next(new BadRequestResponse("Missing required parameter", 422));
		return;
	}

	// Create user in our database
	let newToll = TollModel();

	newToll.project = project;
	newToll.area = area;
	newToll.trialPrice = trialPrice;
	newToll.singlePrice = singlePrice;
	newToll.groupPrice = groupPrice;
	newToll.yoshinoriPrice = yoshinoriPrice;
	newToll.tutor = req.user._id;

	// console.log(newToll);

	newToll.save((err, result) => {
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

// Update Toll
router.put("/updateToll/:tollSlug", isToken, isTutor, (req, res, next) => {
	// console.log(req.body);

	if (req.body.project) {
		req.toll.project = req.body.project;
	}
	if (req.body.area) {
		req.toll.area = req.body.area;
	}
	if (req.body.trialPrice) {
		req.toll.trialPrice = req.body.trialPrice;
	}
	if (req.body.singlePrice) {
		req.toll.singlePrice = req.body.singlePrice;
	}
	if (req.body.groupPrice) {
		req.toll.groupPrice = req.body.groupPrice;
	}
	if (req.body.yoshinoriPrice) {
		req.toll.yoshinoriPrice = req.body.yoshinoriPrice;
	}

	// console.log(req.toll);

	req.toll
		.save()
		.then((toll) => {
			next(new OkResponse(toll.toJSON()));
			return;
		})
		.catch((err) => {
			next(new BadRequestResponse(err));
			return;
		});
});

// View All Tolls
router.get("/tolls", isToken, isAdmin, (req, res, next) => {
	const options = {
		page: +req.query.page || 1,
		limit: +req.query.limit || 10,
		populate: "tutor",
	};

	let query = {};
	// query.role = 1;

	TollModel.paginate(query, options, function (err, result) {
		if (err) {
			// console.log(err);
			next(new BadRequestResponse("Server Error"), 500);
			return;
		}
		// console.log(result);
		result.docs = result.docs.map((toll) => toll.toJSON());
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

// View All Tutor Tolls
router.get("/tutorTolls", isToken, async (req, res, next) => {
	// console.log(req.user._id);
	const options = {
		page: +req.query.page || 1,
		limit: +req.query.limit || 10,
		populate: "tutor",
	};

	let query = {};
	query.tutor = req.user._id;
	// console.log(query);

	TollModel.paginate(query, options, function (err, result) {
		if (err) {
			// console.log(err);
			next(new BadRequestResponse("Server Error"), 500);
			return;
		}
		// console.log(result);
		result.docs = result.docs.map((toll) => toll.toJSON());
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

// View Specific Toll
router.get("/toll/:tollSlug", isToken, isTutor, (req, res, next) => {
	if (req.toll) {
		next(new OkResponse(req.toll.toJSON()));
		return;
	} else {
		next(new BadRequestResponse("Toll not found!", 423));
		return;
	}
});

// Delete Specific Toll
router.delete("/delToll/:tollSlug", isToken, async (req, res, next) => {
	// console.log("req");
	// console.log(req.user);
	// console.log(req.toll);
	// console.log(req.user._id);
	// console.log(req.toll.tutor);
	// console.log(req.user.role);
	if (
		req.user._id.toString() === req.toll.tutor._id.toString() ||
		req.user.role === 1
	) {
		// console.log(req.toll);
		req.toll
			.remove()
			.then((toll) => {
				next(new OkResponse(toll.toJSON()));
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

// Update Draft Bit to done
router.put(
	"/doneToll/:tollSlug",
	isToken,
	isTutor,
	isPaid,
	(req, res, next) => {
		req.toll.status = true;
		req.toll
			.save()
			.then((toll) => {
				next(new OkResponse(toll.toJSON()));
				return;
			})
			.catch((err) => {
				next(new BadRequestResponse(err));
				return;
			});
	}
);

// View All Done Tolls
router.get("/doneTolls", isToken, async (req, res, next) => {
	if (req.user.role === 1 || req.user.role === 2) {
		let query = {};
		query.status = true;

		const options = {
			page: +req.query.page || 1,
			limit: +req.query.limit || 10,
			populate: "tutor",
		};

		if (req.user.role === 2) {
			query.tutor = req.user._id;
		}

		TollModel.paginate(query, options, function (err, result) {
			if (err) {
				// console.log(err);
				next(new BadRequestResponse("Server Error"), 500);
				return;
			}
			// console.log(result);
			result.docs = result.docs.map((toll) => toll.toJSON());
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

// View All unDone Tolls
router.get("/unDoneCourses", isToken, async (req, res, next) => {
	if (req.user.role === 1 || req.user.role === 2) {
		let query = {};
		query.status = false;

		const options = {
			page: +req.query.page || 1,
			limit: +req.query.limit || 10,
			populate: "tutor",
		};

		if (req.user.role === 2) {
			query.tutor = req.user._id;
		}
		TollModel.paginate(query, options, function (err, result) {
			if (err) {
				// console.log(err);
				next(new BadRequestResponse("Server Error"), 500);
				return;
			}
			// console.log(result);
			result.docs = result.docs.map((toll) => toll.toJSON());
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
