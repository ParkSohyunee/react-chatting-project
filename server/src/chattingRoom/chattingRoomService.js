const db = require("../config/db");

exports.createChattingRoom = async (name, userId) => {
  const connection = await db.getConnection();

  try {
    const sql = "INSERT INTO chatting_rooms (name, user_id) VALUES (?,?);";
    const [result] = await connection.query(sql, [name, userId]);

    if (result.affectedRows > 0) {
      return result[0];
    } else {
      throw new Error("다시 시도해주세요.");
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  } finally {
    connection.release();
  }
};
