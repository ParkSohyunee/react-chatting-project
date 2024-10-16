const express = require("express");
const router = express.Router();
const chattingRoomController = require("./chattingRoomController");
const authenticateUser = require("../middleware/authenticateUser");

router.get("/", chattingRoomController.getChattingRooms);
router.post("/", authenticateUser, chattingRoomController.createChattingRoom);
router.patch(
  "/:roomId",
  authenticateUser,
  chattingRoomController.updateChattingRoom
);
router.delete(
  "/:roomId",
  authenticateUser,
  chattingRoomController.deleteChattingRoom
);

module.exports = router;
