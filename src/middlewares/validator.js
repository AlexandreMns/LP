import User from "../models/Users.js";

const ValidateToken = async (Newtoken, req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "No token provided." });
    }

    const user = await User.findOne({ resetPasswordToken: Newtoken });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

export default ValidateToken;
