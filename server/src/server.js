const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const chattingRouter = require("./chattingRoom/routes");

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routing
app.use("/api/chattings", chattingRouter);

const port = 3001;

// routing
app.post("/api/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    const connection = await db.getConnection();
    const sql = "SELECT * FROM users WHERE name = (?)";
    const [result] = await connection.query(sql, [name]);

    connection.release();

    if (result.length > 0) {
      const isCorrectPassword = await bcrypt.compare(
        password,
        result[0].password
      );
      if (isCorrectPassword) {
        try {
          const token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });
          res.status(200).json({
            userId: result[0].id,
            accessToken: token,
          });
        } catch (error) {
          res.status(500).json({ message: "로그인을 다시 시도해주세요." });
        }
      } else {
        return res.status(400).json({ message: "비빌번호를 확인해주세요." });
      }
    } else {
      res.status(400).json({ message: "닉네임을 확인해주세요." });
    }
  } catch (error) {
    console.log(error);
    connection.release();
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/signup", async (req, res) => {
  const { name, password } = req.body;
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(password, saltRounds);

  try {
    const connection = await db.getConnection();
    const sql = "INSERT INTO users (name, password) VALUES (?,?);";
    const [result] = await connection.query(sql, [name, hashPassword]);

    connection.release();

    if (result.affectedRows > 0) {
      res.status(200).json({ userId: result.insertId });
    } else {
      res.status(500).json({ message: "회원가입 다시 시도해주세요." });
    }
  } catch (error) {
    console.log(error);
    connection.release();
    res.status(500).json({ message: error.message });
  }
});

// server start
app.listen(port, () => {
  console.log("서버가 3001번 포트에서 실행중");
});
