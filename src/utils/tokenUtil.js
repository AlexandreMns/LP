import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config.js";

const decodeToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secretKey, (err, decoded) => {
      if (err) {
        console.log("Error:" + err);
        reject();
        return { auth: false, message: "Failed to authenticate" };
      }
      return resolve(decoded);
    });
  });
};

const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

const createToken = (user) => {
  let token = jwt.sign(
    { id: user._id, name: user.name, role: user.role },
    config.secretKey,
    {
      expiresIn: config.expiresIn,
    }
  );
  return { auth: true, token: token };
};

export { decodeToken, comparePassword, createToken };
