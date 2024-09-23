import { Router } from "express";
import { UserController } from "../../controllers/userController.js";
import { UserService } from "../../services/controllers/userService.js";
import authorize from "../../middlewares/authorize.js";

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

// ==========================PUBLIC ROUTES==========================

//Register a new user
router.post("/register", userController.register);

//Login a user
router.post("/login", userController.login);

// ==========================MODERATOR & ADMIN ROUTES==========================

//Get all users
router.get("/all", authorize("moderator"), userController.allUsers);

export default router;
