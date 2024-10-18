import { Router } from "express";
import { UserController } from "../../controllers/userController.js";
import { UserService } from "../../services/controllers/userService.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
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

//Forgot password token
router.get("/forgot-password-token", userController.forgotPasswordToken);

//Forgot password
router.post("/forgot-password", verifyToken, userController.forgotPassword); //???

// ==========================PRIVATE ROUTES==========================

//Get user information
router.get("/me", verifyToken, authorize(roles.CLIENT), userController.me);

//Get user by id
router.get(
  "/:id",
  verifyToken,
  authorize(roles.CLIENT),
  userController.userById
);

//Update user information
router.put(
  "/update",
  verifyToken,
  authorize(roles.CLIENT),
  userController.updateUser
);

//Delete user
router.delete(
  "/delete",
  verifyToken,
  authorize(roles.CLIENT),
  userController.deleteUser
); // Falta fazer

/* Falta implementar licencia de agente para fazer esta rota
//Promotion Request
router.post("/promotion-request", verifyToken, userController.promotionRequest);
*/

export default router;
