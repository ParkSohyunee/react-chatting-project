const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const createUser = async (name, password) => {
  const connection = await db.getConnection();

  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(password, saltRounds);

  try {
    const sql = "INSERT INTO users (name, password) VALUES (?,?);";
    const [result] = await connection.query(sql, [name, hashPassword]);

    if (result.affectedRows > 0) {
      return result;
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  } finally {
    connection.release();
  }
};

// 닉네임과 비밀번호 일치 검증
const validatePassword = async (inputValue, findValue) => {
  const isCorrect = await bcrypt.compare(inputValue, findValue);
  return isCorrect;
};

// 토큰 생성
const getAccessToken = (payload) => {
  const accessToken = jwt.sign({ id: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return accessToken;
};

const loginUser = async (name, password) => {
  const connection = await db.getConnection();

  try {
    const sql = "SELECT * FROM users WHERE name = (?);";
    const [result] = await connection.query(sql, [name]);

    if (result.length > 0) {
      const isValidatePassword = await validatePassword(
        password,
        result[0].password
      );
      if (isValidatePassword) {
        try {
          const token = getAccessToken(result[0].id);
          return {
            userId: result[0].id,
            accessToken: token,
          };
        } catch (error) {
          return { errorCode: "ERROR_LOGIN" };
        }
      } else {
        return { errorCode: "CHECK_PASSWORD" };
      }
    } else {
      return { errorCode: "CHECK_NICKNAME" };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  } finally {
    connection.release();
  }
};

exports.createUser = createUser;
exports.loginUser = loginUser;
