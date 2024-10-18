const authService = require("./authService");

const createUserController = async (req, res) => {
  const { name, password } = req.body;

  try {
    const result = await authService.createUser(name, password);
    res.status(200).json({ userId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUserController = async (req, res) => {
  try {
    const { name, password } = req.body;
    const result = await authService.loginUser(name, password);

    switch (result.errorCode) {
      case "CHECK_NICKNAME":
        return res.status(400).json({ message: result.message });
      case "CHECK_PASSWORD":
        return res.status(400).json({ message: result.message });
      case "ERROR_LOGIN":
        return res.status(500).json({ message: result.message });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("controllerError: ", error);
    res.status(500).json({ message: error.message });
  }
};

exports.createUserController = createUserController;
exports.loginUserController = loginUserController;
