import jwt from "jsonwebtoken";
import config from "../../config.js";
import { HttpStatus } from "../utils/httpStatus.js";

function Verify(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secretKey, (err, decoded) => {
      if (err) {
        console.log("Error:" + err);
        reject();
      }
      return resolve(decoded);
    });
  });
}

function verifyToken(req, res, next) {
  const authorize = req.header("authorization");
  const token = authorize && authorize.split(" ")[1];

  if (!token) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send({ auth: false, message: "No token provided" });
  }

  Verify(token)
    .then((decoded) => {
      req.roleUser = decoded.role;
      //Make that de id of the user is in the request
      req.user = decoded.id;
      next();
    })
    .catch(() => {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .send({ auth: false, message: "Failed to authenticate token" });
    });
}

export default verifyToken;
