const express = require("express");
const router = express.Router();
const chattingRoomController = require("./chattingRoomController");

router.get("/", chattingRoomController.getChattingRooms);
router.post("/", chattingRoomController.createChattingRoom);
router.patch("/:roomId", chattingRoomController.updateChattingRoom);

module.exports = router;
