import { Router } from "express";
import { UserController } from "../../controllers/userController.js";
import { UserService } from "../../services/controllers/userService.js";
import { verifyToken } from "../../middlewares/verifyToken.js";

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

// ==========================PUBLIC ROUTES==========================

//Register a new user
router.post("/register", userController.register);

//Login user
router.post("/login", userController.login);

//Get user information
router.get("/me", verifyToken, userController.me);

//Forgot password token
router.get(
  "/forgot-password-token",
  verifyToken,
  userController.forgotPasswordToken
);

//Forgot password
router.post("/forgot-password", verifyToken, userController.forgotPassword);

//Get all propertys
router.get(
  "/all-properties/:params",
  verifyToken,
  userController.allProperties
);

export default router;
