const express = require("express");
const router = express.Router();
const controller = require("../controllers/index");
const auth = require("../middlewares/auth");
const roleCheck = require("../middlewares/roleCheck");

router.get("/", auth, /* roleCheck.isAdmin, */ controller.getIndex);

module.exports = router;
