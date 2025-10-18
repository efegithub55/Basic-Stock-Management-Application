const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login");

router.get("/", loginController.getLogin);
router.get("/logout", loginController.logout);
router.post("/", loginController.postLogin);

module.exports = router;
