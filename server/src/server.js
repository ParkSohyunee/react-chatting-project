const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

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

// server start
app.listen(port, () => {
  console.log("서버가 3001번 포트에서 실행중");
});
