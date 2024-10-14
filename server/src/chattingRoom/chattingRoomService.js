const db = require("../config/db");

const getChattingRooms = async () => {
  const connection = await db.getConnection();

  try {
    const sql = "SELECT * FROM chatting_rooms WHERE roomStatus = 'ACTIVE';";
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
    const sql = "INSERT INTO chatting_rooms (name, userId) VALUES (?,?);";
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

const isQwner = async ({ roomId, userId }) => {
  const connection = await db.getConnection();

  try {
    const sql =
      "SELECT userId FROM chatting_rooms WHERE id = (?) AND roomStatus = 'ACTIVE';";
    const [response] = await connection.query(sql, [roomId]);

    if (response[0]["user_id"] !== userId) {
      return {
        errorCode: "NOT_PERMISSION",
        message: "권한이 없는 사용자입니다.",
      };
    }
    return null;
  } catch (error) {
    // 사용자를 찾을 수 없을 경우 (response: [])
    throw new Error(error);
  } finally {
    connection.release();
  }
};

const updateChattingRoom = async ({ name, roomId }) => {
  const connection = await db.getConnection();

  try {
    const sql = "UPDATE chatting_rooms SET name = (?) WHERE id = (?);";
    const [result] = await connection.query(sql, [name, roomId]);

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

const deleteChattingRoom = async ({ roomId }) => {
  const connection = await db.getConnection();

  try {
    const sql =
      "UPDATE chatting_rooms SET roomStatus = 'INACTIVE' WHERE id = (?);";
    const [result] = await connection.query(sql, [roomId]);

    if (result.affectedRows > 0) {
      return result;
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
exports.updateChattingRoom = updateChattingRoom;
exports.deleteChattingRoom = deleteChattingRoom;
exports.isOwner = isQwner;
