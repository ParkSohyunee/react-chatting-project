const express = require("express");
const router = express.Router();
const chattingRoomController = require("./chattingRoomController");

router.post("/", chattingRoomController);

module.exports = router;
