import { Router } from "express";
import { UserController } from "../../controllers/userController.js";
import { UserService } from "../../services/controllers/userService.js";
import verifyToken from "../../middlewares/verifyToken.js";
import authorize from "../../middlewares/authorize.js";
import { roles } from "../../models/usersModel.js";

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

//Forgot password
router.post("/forgot-password", verifyToken, userController.forgotPassword);

// ==========================MODERATOR & ADMIN ROUTES==========================

//Get all users
router.get(
  "/all",
  verifyToken,
  authorize(roles.MODERATOR),
  userController.allUsers
);

//Change user role
router.put(
  "/change-role",
  verifyToken,
  authorize(roles.ADMIN),
  userController.changeRoles
);

export default router;
