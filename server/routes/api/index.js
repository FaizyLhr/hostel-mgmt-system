let router = require("express").Router();

router.use("/values", require("./values"));
router.use("/users", require("./users"));
router.use("/beds", require("./beds"));

module.exports = router;
