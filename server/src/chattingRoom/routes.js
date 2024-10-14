const express = require("express");
const router = express.Router();
const chattingRoomController = require("./chattingRoomController");

router.get("/", chattingRoomController.getChattingRooms);
router.post("/", chattingRoomController.createChattingRoom);

module.exports = router;
