let router = require("express").Router();
let {
	OkResponse,
	BadRequestResponse,
	UnauthorizedResponse,
} = require("express-http-response");

router.get("/", function (req, res, next) {
	next(new OkResponse({ message: `Api's are working` }));
	return;
});

module.exports = router;
