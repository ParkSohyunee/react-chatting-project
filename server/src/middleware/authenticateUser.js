const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  // 토큰이 없는 경우
  if (!token) {
    console.log("토큰이 없는데 로그인이 필요한 기능을 사용하는 경우");
    return res.status(401).json({ message: "로그인이 필요해요." });
  }

  // 유효한 토큰인지 검증
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (error) {
    console.log("정상적인 토큰이 아님, 재로그인 필요");
    res.status(401).json({ message: "로그인을 다시 시도해주세요." });
    return;
  }
};

module.exports = authenticateUser;
