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

//Get all users
router.get(
  "/all",
  verifyToken,
  authorize(roles.MODERATOR),
  adminController.allUsers
);

// ==========================ADMIN ROUTES==========================

//Change user role
router.put(
  "/change-role",
  verifyToken,
  authorize(roles.ADMIN),
  adminController.changeRoles
);

export default router;
