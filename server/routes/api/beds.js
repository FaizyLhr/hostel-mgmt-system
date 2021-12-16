let router = require("express").Router();
let {
	OkResponse,
	BadRequestResponse,
	UnauthorizedResponse,
} = require("express-http-response");

const {
	isAdmin,
	isBedFree,
	isToken,
} = require("../auth");

const BedModel = require("../../models/Bed");

router.param("bedSlug", (req, res, next, slug) => {
	BedModel.findOne({
		slug
	}, (err, bed) => {
		if (!err && bed !== null) {
			// console.log(bed);
			req.bed = bed;
			return next();
		}
		return next(new BadRequestResponse("Bed not found!", 423));
	});
});

router.get("/", function (req, res, next) {
	next(new OkResponse({
		message: `Products Api's are working`
	}));
	return;
});

router.put(
	"/free/:bedSlug",
	isToken,
	isAdmin,
	isBedFree,
	async (req, res, next) => {
		console.log(req.user);
		req.bed.isFree = true;

		req.bed.save((err, result) => {
			if (err) {
				// console.log(err);
				return next(new BadRequestResponse(err));
			} else {
				// console.log(result);
				return next(new OkResponse({
					bed: req.bed
				}));
			}
		});
	}
);

module.exports = router;