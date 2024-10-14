const db = require("../config/db");

const getChattingRooms = async () => {
  const connection = await db.getConnection();

  try {
    const sql = "SELECT * FROM chatting_rooms WHERE room_status = 'ACTIVE';";
    const [result] = await connection.query(sql);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  } finally {
    connection.release();
  }
};

const createChattingRoom = async (name, userId) => {
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

exports.getChattingRooms = getChattingRooms;
exports.createChattingRoom = createChattingRoom;
