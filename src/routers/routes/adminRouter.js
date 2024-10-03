import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken.js";
import authorize from "../../middlewares/authorize.js";
import { roles } from "../../models/usersModel.js";
import { AdminController } from "../../controllers/adminController.js";
import { AdminService } from "../../services/controllers/adminService.js";

const router = Router();
const adminService = new AdminService();
const adminController = new AdminController(adminService);


// ==========================MODERATOR & ADMIN ROUTES==========================

// Get all users
router.get(
  "/all",
  verifyToken,
  authorize(roles.AGENT),
  adminController.allUsers
);

// ==========================ADMIN ROUTES==========================

// Change user role
router.put(
  "/change-role",
  verifyToken,
  authorize(roles.ADMIN),
  adminController.changeRoles
);

// Get dashboard data
router.get(
  "/dashboard",
  verifyToken,
  authorize(roles.ADMIN),
  adminController.getDashboard
);

// Create a new user - Não funcional
router.post(
  "/create-user",
  verifyToken,
  authorize(roles.ADMIN),
  adminController.createUser
);

// Delete a user
router.delete('/delete-user/:userId', verifyToken, authorize(roles.ADMIN), adminController.deleteUser);

//Get user by Id
router.get('/user/:userId', verifyToken, authorize(roles.ADMIN), adminController.getUserById);

export default router;