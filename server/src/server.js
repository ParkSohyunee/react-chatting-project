const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3001;

// routing
app.post("/api/login", (req, res) => {
  const { name, password } = req.body;

  db.getConnection((err, connection) => {
    if (err) {
      console.log("DB connection error: ", err);
      res.status(500).send("DB connection error");
      return;
    }
    connection.query(
      "select * from users where name = (?);",
      [name],
      async (error, result) => {
        connection.release();

        if (error) {
          res.status(500).send("로그인 쿼리 실행 에러");
          return;
        }
        if (result.length > 0) {
          const isCorrectPassword = await bcrypt.compare(
            password,
            result[0].password
          );
          if (isCorrectPassword) {
            jwt.sign(
              { id: result[0].id },
              process.env.JWT_SECRET,
              { expiresIn: process.env.JWT_EXPIRES_IN },
              (err, token) => {
                console.log(token);
                if (err) {
                  res.status(500).json({ message: "로그인 재시도" });
                }
                res.json({
                  id: result[0].id,
                  accessToken: token,
                });
              }
            );
          } else {
            res.status(400).json({ message: "비밀번호 확인" });
          }
        } else {
          res.status(400).json({ message: "존재하지 않는 사용자" });
        }
      }
    );
  });
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
      console.log("result: ", result); // ResultSetHeader

      return res.status(200).json({
        message: "회원가입 성공",
        userId: result.insertId,
      });
    } else {
      return res.status(500).json({
        message: "회원가입 실행 에러",
      });
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
