let router = require("express").Router();

router.use("/values", require("./values"));
// router.use("/", require("./categories"));
router.use("/users", require("./users"));
// router.use("/", require("./tolls"));
// router.use("/", require("./courses"));
// router.use("/", require("./products"));
// router.use("/", require("./applications"));
// router.use("/", require("./chat"));
// router.use("/", require("./friend"));

module.exports = router;
