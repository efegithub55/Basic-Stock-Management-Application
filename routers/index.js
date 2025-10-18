const express = require("express");
const router = express.Router();
const controller = require("../controllers/index");
const auth = require("../middlewares/auth");

router.get("/", auth, controller.getIndex);

module.exports = router;
