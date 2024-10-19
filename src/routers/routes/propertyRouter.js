import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken.js";
import authorize from "../../middlewares/authorize.js";
import { roles } from "../../models/usersModel.js";
import { PropertyService } from "../../services/controllers/propertyService.js";
import { PropertyController } from "../../controllers/propertyController.js";

const router = Router();
const propertyService = new PropertyService();
const propertyController = new PropertyController(propertyService);

// ==========================PUBLIC ROUTES==========================

// Get all properties
router.get("/all/", verifyToken, propertyController.allProperties);

// Get property by id
router.get("/by-id/:id", verifyToken, propertyController.getPropertyById);

// ==========================AGENT ROUTES==========================

// Create a new Property
router.post(
  "/add",
  verifyToken,
  authorize(roles.AGENT),
  propertyController.addProperty
);

// Delete a Property
router.delete(
  "/delete/:id",
  verifyToken,
  authorize(roles.AGENT),
  propertyController.deleteProperty
);

router.put(
  "/reserve/:id",
  verifyToken,
  authorize(roles.AGENT),
  propertyController.reserveProperty
);

// ==========================ADMIN ROUTES==========================

// Get sold properties
router.get(
  "/sold/",
  verifyToken,
  authorize(roles.ADMIN),
  propertyController.getSoldProperties
);
export default router;
