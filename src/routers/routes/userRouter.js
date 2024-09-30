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

//Forgot password token
router.get(
  "/forgot-password-token",
  userController.forgotPasswordToken
);

//Forgot password
router.post("/forgot-password", verifyToken, userController.forgotPassword); //???

// ==========================PRIVATE ROUTES==========================

//Get user information
router.get("/me", verifyToken, userController.me);

//Get user by id
router.get("/:id", verifyToken, userController.userById);

// Adicionar item à wishlist
router.post('/wishlist/:itemId', verifyToken, userController.addToWishlist.bind(userController));

// Remover item da wishlist
router.delete('/wishlist/:itemId', verifyToken, userController.removeFromWishlist.bind(userController));

// Listar wishlist
router.get('/wishlist', verifyToken, userController.viewWishlist.bind(userController));



export default router;
