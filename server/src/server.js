const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

const WebSocket = require("ws");

// Create an HTTP server and a WebSocket server
const server = require("http").createServer(app);
const ws = new WebSocket.WebSocketServer({ server });

const authRouter = require("./auth/routes");
const chattingRouter = require("./chattingRoom/routes");

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routing
app.use("/api/auth", authRouter);
app.use("/api/chattings", chattingRouter);

const port = 3001;

let sockets = [];

ws.on("connection", (ws, req) => {
  // 웹소켓 식별
  ws.id = req.headers["sec-websocket-key"];
  sockets.push(ws);

  ws.on("close", (code, reason) => {
    // console.log(code, reason);
    sockets = sockets.filter((socket) => socket.id !== ws.id);
    console.log(sockets.length);
  });

  // Broadcast the message to all connected clients
  sockets.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(`new client connected!`);
    }
  });

  // reply
  ws.on("message", (message) => {
    sockets.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });
});

// Start the WebSocket server
server.listen(port, () => {
  console.log("서버가 3001번 포트에서 실행중");
});
