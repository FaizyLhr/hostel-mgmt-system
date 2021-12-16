const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
let secret = require("../config").secret;

let {
	BadRequestResponse,
	UnauthorizedResponse,
	ForbiddenResponse,
} = require("express-http-response");

function isAdmin(req, res, next) {
	// console.log("admin");
	// console.log(req.user);
	if (!req.user) {
		// console.log("chk");
		next(new BadRequestResponse("No User Found"));
		return;
	}
	if (!(req.user.role === 1)) {
		// console.log("Not Admin");
		next(new UnauthorizedResponse("Access Denied"));
		return;
	}
	// console.log(req.user);
	// console.log("Admin PAssed");
	next();
}

function isTutor(req, res, next) {
	// console.log(req.user);
	if (!req.user) {
		next(new BadRequestResponse("No User Found"));
		return;
	}
	if (!(req.user.role === 2)) {
		next(new UnauthorizedResponse("Access Denied"));
		return;
	}
	// console.log("passed");
	next();
}

function isStudent(req, res, next) {
	// console.log(req.user);
	if (!req.user) {
		next(new BadRequestResponse("No User Found"));
		return;
	}
	if (!(req.user.role === 3)) {
		next(new UnauthorizedResponse("Access Denied"));
		return;
	}
	next();
}

function isBedFree(req, res, next) {
	// console.log(req.user.status);
	if (req.bed.isFree === true) {
		return next(new ForbiddenResponse("Bed Already Free"));
	}
	next();
}

function isBlocked(req, res, next) {
	// console.log(req.user.status);
	if (req.emailUser.status === 2) {
		next(new ForbiddenResponse("User Already Blocked"));
		return;
	}
	next();
}

function isPosted(req, res, next) {
	// console.log(req.user.status);

	// console.log(req.user);
	if (req.app.isPosted === true) {
		next(new ForbiddenResponse("Application Already Posted"));
		return;
	}
	next();
}

function isRead(req, res, next) {
	// console.log(req.user.status);

	// console.log(req.user);
	if (req.msg.status === 1) {
		return next(new ForbiddenResponse("Msg Already Read"));
	}
	next();
}

function isAuthentic(req, res, next) {
	// console.log(req.user.status);

	// console.log(req.user._id);
	// console.log(req.friend.user1._id);
	// console.log(req.friend.user2._id);
	// console.log(req.user._id.toString());
	// console.log(req.friend.user1._id.toString());
	// console.log(req.friend.user2._id.toString());

	// console.log(req.user._id.toString() === req.friend.user1._id.toString());
	// console.log(req.user._id.toString() === req.friend.user2._id.toString());

	if (
		req.user._id.toString() === req.friend.user1._id.toString() ||
		req.user._id.toString() === req.friend.user2._id.toString()
	) {
		console.log("if");
		next();
	} else {
		console.log("else");
		return next(new UnauthorizedResponse("Not Authorized"));
	}
}

function isAccepted(req, res, next) {
	// console.log(req.user.status);

	// console.log(req.user);
	if (req.app.status === 1) {
		next(new ForbiddenResponse("Application Already Accepted"));
		return;
	}
	next();
}

function isRejected(req, res, next) {
	// console.log(req.user.status);
	if (req.app.status === 2) {
		next(new ForbiddenResponse("Application Already Rejected"));
		return;
	}
	next();
}

function isUnBlocked(req, res, next) {
	// console.log(req.user.status);

	// console.log(req.user);
	if (req.emailUser.status === 1) {
		next(new ForbiddenResponse("User Already UnBlocked"));
		return;
	}
	next();
}

function isPaid(req, res, next) {
	// console.log(req.user.status);
	if (req.course) {
		// console.log("course", req.course);
		if (req.course.isDone === true) {
			next(new ForbiddenResponse("Course Already Done"));
			return;
		}
		next();
	} else if (req.toll) {
		// console.log("toll", req.toll);
		if (req.toll.status === true) {
			next(new ForbiddenResponse("Toll Already Done"));
			return;
		}
		next();
	} else {
		// console.log("err");
		next(new ForbiddenResponse("Not Found"));
		return;
	}
}

const isToken = function (req, res, next) {
	// console.log(req.headers.authorization);
	if (
		req.headers.authorization === undefined ||
		req.headers.authorization.length === 0
	) {
		// console.log(req.headers.authorization);
		return next(new UnauthorizedResponse("You are not logged in"));
	}
	var token = req.headers.authorization.split(" ");
	// console.log(token[1]);
	if (typeof token[1] === undefined || typeof token[1] === null) {
		next(new UnauthorizedResponse("You are not logged in"));
		return;
	} else {
		jwt.verify(token[1], secret, (err, data) => {
			// console.log(data.email);
			if (err) {
				// console.log(err);
				next(new UnauthorizedResponse(err));
				return;
			} else {
				UserModel.findOne({ email: data.email })
					.then((user) => {
						// console.log(user);
						req.user = user;
						// console.log("Token");
						// console.log(req.user);
						next();
					})
					.catch((err) => next(err));
			}
		});
	}
};

module.exports = {
	isAdmin,
	isPaid,
	isTutor,
	isStudent,
	isToken,
	isBlocked,
	isUnBlocked,
	isAccepted,
	isRejected,
	isPosted,
	isAuthentic,
	isRead,
	isBedFree
};
