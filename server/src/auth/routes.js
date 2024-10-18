const express = require("express");
const router = express.Router();
const authController = require("./authController");

router.post("/signup", authController.createUserController);
router.post("/login", authController.loginUserController);

module.exports = router;
