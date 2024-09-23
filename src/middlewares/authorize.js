import { decodeToken } from "../utils/tokenUtil.js";
import { roleHierarchy } from "../models/Users.js";

const authorize = (requiredRole) => {
  return async (req, res, next) => {
    try {
      // Extract the token from the 'x-access-token' header
      const token = req.header("x-access-token");

      if (!token) {
        return res
          .status(401)
          .json({ message: "Access denied. Token not provided." });
      }
      // Decode the token
      const decoded = await decodeToken(token);

      // Extract the user's role from the decoded token
      const userRole = decoded.role;

      if (!userRole) {
        return res
          .status(403)
          .json({ message: "User role not found in token." });
      }

      // Check if the user has the required role by comparing with roleHierarchy
      if (roleHierarchy[userRole] >= roleHierarchy[requiredRole]) {
        return next(); // Authorized, proceed to the next middleware or controller
      } else {
        return res
          .status(403)
          .json({ message: "Permission denied. Insufficient role." });
      }
    } catch (error) {
      // Handle token decoding errors or others
      return res.status(500).json({ message: error });
    }
  };
};

export default authorize;
