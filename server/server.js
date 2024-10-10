const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./config/db");
const bcrypt = require("bcrypt");

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3001;

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
            res.json({ message: "로그인 성공" });
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

// routing
app.post("/api/signup", async (req, res) => {
  const { name, password } = req.body;
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(password, saltRounds);

  db.getConnection((err, connection) => {
    if (err) {
      console.log("DB connection error: ", err);
      res.status(500).send("DB connection error");
      return;
    }
    connection.query(
      "insert into users (name, password) values (?,?);",
      [name, hashPassword],
      (error, result) => {
        connection.release(); // connection을 pool에 반환

        if (error) {
          console.dir("쿼리 실행 에러: ", error);
          res.status(500).send("회원가입 실행 에러");
          return;
        }
        if (result.affectedRows > 0) {
          console.log("result: ", result);

          // 쿼리 성공하면 리스폰스 보내고, 응답 종료
          res.json({
            message: "회원가입 성공!",
            // userId: id, // 무슨아이디...?
          });
        }
      }
    );
  });
});

// server start
app.listen(port, () => {
  console.log("서버가 3001번 포트에서 실행중");
});
