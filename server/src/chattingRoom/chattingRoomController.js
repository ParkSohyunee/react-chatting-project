const chattingRoomService = require("./chattingRoomService");

const getChattingRooms = async (_, res) => {
  try {
    const response = await chattingRoomService.getChattingRooms();
    return res.status(200).json({ result: response });
  } catch (error) {
    console.error("controllerError: ", error);
    res.status(500).json({ message: error.message });
  }
};

const createChattingRoom = async (req, res) => {
  const { name } = req.body;

  try {
    await chattingRoomService.createChattingRoom(name, req.userId);
    return res.status(201).json({ result: null });
  } catch (error) {
    console.error("controllerError: ", error);
    res.status(500).json({ message: error.message });
  }
};

const updateChattingRoom = async (req, res) => {
  const { name } = req.body;
  const { roomId } = req.params;

  // 수정 권한 여부 체크
  const checkEditPermission = await chattingRoomService.isOwner({
    roomId,
    userId: req.userId,
  });

  if (
    checkEditPermission &&
    checkEditPermission.errorCode === "NOT_PERMISSION"
  ) {
    return res.status(403).json({ message: checkEditPermission.message });
  }

  try {
    await chattingRoomService.updateChattingRoom({ name, roomId });
    return res.status(201).json({ result: null });
  } catch (error) {
    console.error("controllerError: ", error);
    res.status(500).json({ message: error.message });
  }
};

const deleteChattingRoom = async (req, res) => {
  const { roomId } = req.params;

  // 삭제 권한 여부 체크
  const checkEditPermission = await chattingRoomService.isOwner({
    roomId,
    userId: req.userId,
  });

  if (
    checkEditPermission &&
    checkEditPermission.errorCode === "NOT_PERMISSION"
  ) {
    return res.status(403).json({ message: checkEditPermission.message });
  }

  try {
    await chattingRoomService.deleteChattingRoom({ roomId });
    return res.status(200).json({ result: null });
  } catch (error) {
    console.error("controllerError: ", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getChattingRooms = getChattingRooms;
exports.createChattingRoom = createChattingRoom;
exports.updateChattingRoom = updateChattingRoom;
exports.deleteChattingRoom = deleteChattingRoom;
