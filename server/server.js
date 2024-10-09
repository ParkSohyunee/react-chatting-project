const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./config/db");
const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3001; // react의 포트번호와 다르게 하기 위해

// routing
app.get("/api", (req, res) => {
  res.json({ title: "Hello World!" });
  res.send("Hello World!");
});

// routing
app.post("/api/signup", (req, res) => {
  const { id, name, age, password } = req.body;

  db.getConnection((err, connection) => {
    if (err) {
      console.log("DB connection error: ", err);
      res.status(500).send("DB connection error");
      return;
    }
    console.log("DB 연결 완료");

    connection.query(
      "insert into users (id, name, age, password) values (?,?,?,?);",
      [id, name, age, password],
      (error, result) => {
        connection.release(); // connection을 pool에 반환

        if (error) {
          console.dir("쿼리 실행 에러: ", error);
          res.status(500).send("DB connection error");
          return;
        }
        if (result) {
          console.log("result: ", result);

          // 쿼리 성공하면 리스폰스 보내고, 응답 종료
          res.json({
            userId: id,
            userName: name,
            userAge: age,
            userPassword: password,
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
