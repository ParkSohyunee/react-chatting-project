const mysql = require("mysql2");
require("dotenv").config;

// rather connections one-by-one
const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST, // db의 ip주소
  user: process.env.USER, // 환경변수에 저장 (host? use?)
  password: process.env.PASSWORD, // 환경변수에 저장
  port: process.env.PORT,
  database: process.env.DATABASE,
});

module.exports = db;
