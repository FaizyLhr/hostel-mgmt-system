let router = require("express").Router();

let {
	OkResponse,
	BadRequestResponse,
	UnauthorizedResponse,
} = require("express-http-response");

const { isToken } = require("../auth");
// const { query } = require("express-validator");

const FriendModel = require("../../models/Friend");
const UserModel = require("../../models/User");

// General Check
router.get("/", function (req, res, next) {
	return next(new OkResponse({ message: `Friends Api's are working` }));
});

// get friend for every time friendSlug given
router.param("friendSlug", function (req, res, next, slug) {
	FriendModel.findOne({ slug }).then(function (friend) {
		if (!friend) {
			return next(new BadRequestResponse("No friend Found"));
		}
		req.friend = friend;
		// console.log(req.friend);

		return next();
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

// Add a friend Chat
router.post("/addFriend/:email", isToken, (req, res, next) => {
	// console.log(req.emailUser);
	// console.log(req.user);

	let query = {
		$or: [
			{ user1: req.emailUser._id, user2: req.user._id },
			{ user2: req.emailUser._id, user1: req.user._id },
		],
	};
	// console.log(query);
	FriendModel.find(query)
		.then((match) => {
			// console.log(match);
			// console.log(match.length !== 0);

			if (match.length !== 0) {
				next(new OkResponse({ message: "Already Friends" }));
			} else {
				// console.log("friend");

				new FriendModel({ user1: req.user._id, user2: req.emailUser._id })
					.save()
					.then((friend) => {
						// console.log(friend);
						next(new OkResponse({ friend: friend }));
					})
					.catch((err) => {
						next(new BadRequestResponse(err));
					});
			}
		})
		.catch((err) => {
			next(new BadRequestResponse(err));
		});
});

// View Friend's Messages
router.get("/friend/:friendSlug", isToken, (req, res, next) => {
	// console.log(req.friend);
	req.friend
		.populate("user1", "email nameEng profilePic")
		.populate("user2", "email nameEng profilePic")
		.execPopulate()
		.then(function (results) {
			// console.log(results);
			next(new OkResponse({ friend: results }));
		})
		.catch((err) => next(new BadRequestResponse(err)));
});

// View All Friend's
router.get("/friends", isToken, function (req, res, next) {
	const options = {
		page: +req.query.page || 1,
		limit: +req.query.limit || 10,
		populate: [
			{
				path: "user1",
				model: "User",
				select: "slug nameEng profilePic",
			},
			{
				path: "user2",
				model: "User",
				select: "slug nameEng profilePic",
			},
			{
				path: "lastMessage",
				model: "Chat",
				select: "createdBy sentTo message createdAt",
			},
		],
		sort: {
			updatedAt: -1,
		},
	};
	let query = {
		$or: [{ user1: req.user._id }, { user2: req.user._id }],
	};
	// console.log(query);
	FriendModel.paginate(query, options, (err, result) => {
		if (err) {
			// console.log(err);
			return next(new BadRequestResponse("Server Error"));
		} else {
			// console.log(result);
			return next(new OkResponse({ result: result.docs }));
		}
	});
});

// Delete Friend
router.delete("/delFriend/:friendSlug", isToken, async (req, res, next) => {
	// console.log(req.user);
	// console.log(req.friend);
	// console.log(req.user._id);
	// console.log(req.friend.user1);
	// console.log(req.friend.user2);
	// console.log(req.user._id.toString() === req.friend.user1.toString());
	// console.log(req.user._id.toString() === req.friend.user2.toString());
	if (
		req.user._id.toString() === req.friend.user1.toString() ||
		req.user._id.toString() === req.friend.user2.toString()
	) {
		// console.log(req.toll);
		req.friend
			.remove()
			.then((friend) => {
				next(new OkResponse(friend.toJSON()));
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

module.exports = router;
