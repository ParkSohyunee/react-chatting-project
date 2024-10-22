const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const db = require("./config/db");

const app = express();

const WebSocket = require("ws");

// Create an HTTP server and a WebSocket server
const server = require("http").createServer(app);
const ws = new WebSocket.WebSocketServer({ server });

const authRouter = require("./auth/routes");
const chattingRouter = require("./chattingRoom/routes");
const { URLSearchParams } = require("url");

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routing
app.use("/api/auth", authRouter);
app.use("/api/chattings", chattingRouter);

const port = 3001;

let sockets = [];

ws.on("connection", async (ws, req) => {
  const params = new URLSearchParams(req.url.split("?")[1]);
  const token = params.get("token");

  // 토큰 검증 및 채팅방에 입장한 사용자 아이디 확인
  let userId;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    userId = payload.id;
  } catch (error) {
    console.log("웹소켓 연결 후 토큰 검증 시 에러 발생:", error);
    throw new Error();
  }

  // 확인한 아이디로 user table에서 사용자 찾기
  const connection = await db.getConnection();

  let userName = "";

  try {
    const sql = "SELECT name FROM users WHERE id = (?);";
    const [result] = await connection.query(sql, [userId]);

    if (result.length > 0) {
      userName = result[0].name;
    }
  } catch (error) {
    console.log("웹소켓 연결 후, 사용자 찾는 쿼리에서 에러 발생", error);
    throw new Error(error);
  } finally {
    connection.release();
  }

  // 웹소켓 식별하고, 저장
  ws.id = req.headers["sec-websocket-key"];
  sockets.push(ws);

  // 웹소켓 연결 종료 시 배열에서 제거하고, 브로드캐스팅
  ws.on("close", () => {
    sockets = sockets.filter((socket) => socket.id !== ws.id);
    sockets.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "system",
            message: `${userName}님이 나갔습니다.`,
          })
        );
      }
    });
  });

  // 웹소켓 연결 에러일 때
  ws.on("error", (error) => {
    console.log("웹소켓 연결 에러", error);
  });

  // Broadcast the message to all connected clients
  sockets.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "system",
          message: `${userName}님이 참여했습니다.`,
        })
      );
    }
  });

  // reply
  ws.on("message", (message) => {
    sockets.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "receiver",
            message: JSON.parse(message).message,
          })
        );
      }
    });
  });
});

// Start the WebSocket server
server.listen(port, () => {
  console.log("서버가 3001번 포트에서 실행중");
});
