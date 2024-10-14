const chattingRoomService = require("./chattingRoomService");
const jwt = require("jsonwebtoken");

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

  const token = req.headers["authorization"]?.split(" ")[1];

  // 토큰이 없는 경우
  if (!token) {
    console.log("토큰이 없는데 로그인이 필요한 기능을 사용하는 경우");
    res.status(401).json({ message: "로그인이 필요해요." });
    return;
  }

  // 유효한 토큰인지 검증
  let userId;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    userId = payload.id;
  } catch (error) {
    console.log("정상적인 토큰이 아님, 재로그인 필요");
    res.status(401).json({ message: "로그인을 다시 시도해주세요." });
    return;
  }

  try {
    await chattingRoomService.createChattingRoom(name, userId);
    return res.status(201).json({ result: null });
  } catch (error) {
    console.error("controllerError: ", error);
    res.status(500).json({ message: error.message });
  }
};

const updateChattingRoom = async (req, res) => {
  const { name } = req.body;
  const { roomId } = req.params;

  const token = req.headers["authorization"]?.split(" ")[1];

  // 토큰이 없는 경우
  if (!token) {
    console.log("토큰이 없는데 로그인이 필요한 기능을 사용하는 경우");
    res.status(401).json({ message: "로그인이 필요해요." });
    return;
  }

  // 유효한 토큰인지 검증
  let userId;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    userId = payload.id;
  } catch (error) {
    console.log("정상적인 토큰이 아님, 재로그인 필요");
    res.status(401).json({ message: "로그인을 다시 시도해주세요." });
    return;
  }

  // 수정 권한 여부 체크
  const checkEditPermission = await chattingRoomService.isOwner({
    roomId,
    userId,
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

exports.getChattingRooms = getChattingRooms;
exports.createChattingRoom = createChattingRoom;
exports.updateChattingRoom = updateChattingRoom;
