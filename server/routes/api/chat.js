let router = require("express").Router();
let {
	OkResponse,
	BadRequestResponse,
	UnauthorizedResponse,
} = require("express-http-response");

const { isAuthentic, isRead, isToken } = require("../auth");

const ChatModel = require("../../models/Chat");
const FriendModel = require("../../models/Friend");
const UserModel = require("../../models/User");

// function process()

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

// get friend for every time friendSlug given
router.param("friendSlug", function (req, res, next, slug) {
	FriendModel.findOne({ slug })
		.populate("user1")
		.populate("user2")
		.then((friend) => {
			if (!friend) {
				return next(new BadRequestResponse("No User Found"));
			}
			req.friend = friend;
			// console.log(req.friend);
			return next();
		})
		.catch((err) => {
			// console.log(err);
			return next(new BadRequestResponse(err));
		});
});

// get Message for every time msgSlug given
router.param("msgSlug", function (req, res, next, slug) {
	ChatModel.findOne({ slug })
		.then((msg) => {
			if (!msg) {
				return next(new BadRequestResponse("No User Found"));
			}
			req.msg = msg;
			// console.log(req.msg);
			return next();
		})
		.catch((err) => {
			// console.log(err);
			return next(new BadRequestResponse(err));
		});
});

// Add a new Message
router.post("/chat/:friendSlug", isToken, isAuthentic, (req, res, next) => {
	// console.log(req.friend.user1.email);
	// console.log("ins");

	if (req.body.message === undefined || req.body.message === null) {
		// console.log("ID");
		return next(new BadRequestResponse("Missing required parameter", 422));
	}

	// save the message and send Event
	let chat = new ChatModel();

	chat.friend = req.friend._id;
	chat.createdBy = req.user._id;
	chat.message = req.body.message;

	if (req.body.files) {
		chat.files = req.body.files;
	}

	if (req.user.email === req.friend.user1.email) {
		chat.sentTo = req.friend.user1;
	} else {
		chat.sentTo = req.friend.user2;
	}
	// console.log("Message:::::::::::::", chat);
	// console.log("SentTo:::::::::::::", chat.sentTo);
	chat.save(function (err, result) {
		if (err) {
			return next(new BadRequestResponse("Server Error"));
		} else {
			req.friend.chatMessages.push(chat._id);
			req.friend.lastMessage = chat._id;
			req.friend
				.save()
				.then(() => {
					// allSportsSocket.emit("conversation" + chat.sentTo);
					// next(new OkResponse({ proposal: proposal }));
				})
				.catch((err) => next(new BadRequestResponse(err)));

			next(new OkResponse({ Chat: result }));
		}
	});
});

// View All Messages
router.get("/chats/:friendSlug", isToken, isAuthentic, (req, res, next) => {
	// console.log(req.friend);
	// console.log(req.friend.user1.email);

	const options = {
		page: +req.query.page || 1,
		limit: +req.query.limit || 20,
		sort: {
			createdAt: -1,
		},
	};

	let query = {
		friend: req.friend._id,
	};

	// console.log(query);
	ChatModel.paginate(query, options, (err, history) => {
		if (err) {
			// console.log(err);
			next(new BadRequestResponse("Server Error"));
		} else {
			// console.log(history.docs);
			next(
				new OkResponse({
					history: history.docs,
					user: {
						_id: req.friend._id,
						lastMessage: req.friend.lastMessage,
						createdAt: req.friend.createdAt,
						updatedAt: req.friend.updatedAt,
						Receiver:
							req.friend.user1.id === req.user.id
								? req.friend.user2
								: req.friend.user1,
					},
				})
			);
		}
	}).catch((error) => {
		console.log(error);
		next(new BadRequestResponse(error));
	});
});

// Change chat status to Read
router.put("/readChat/:msgSlug", isToken, isRead, (req, res, next) => {
	console.log(req.user);
	req.msg.status = 1;

	req.msg.save((err, result) => {
		if (err) {
			// console.log(err);
			next(new BadRequestResponse(err));
			return;
		} else {
			// console.log(result);
			next(new OkResponse(req.msg.toJSON()));
			return;
		}
	});
});

// Get UnRead Count message
router.get(
	"/unReadCount/:friendSlug",
	isToken,
	isAuthentic,
	(req, res, next) => {
		console.log(req.user);
		console.log(req.friend);
		// console.log(req.friend.user1.email);

		// console.log(query);
		ChatModel.count(
			{
				friend: req.friend._id,
				status: 2,
			},
			(err, count) => {
				if (err) {
					console.log(err);
					return next(new BadRequestResponse(err));
				}
				return next(new OkResponse({ count }));
			}
		);
	}
);

module.exports = router;
