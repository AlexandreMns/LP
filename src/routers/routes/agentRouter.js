import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken.js";
import authorize from "../../middlewares/authorize.js";
import { roles } from "../../models/usersModel.js";
import { AgentService } from "../../services/controllers/agentService.js";
import { AgentController } from "../../controllers/agentController.js";

const router = Router();
const agentService = new AgentService();
const agentController = new AgentController(agentService);

// ==========================AGENT ROUTES==========================

//Create a new Property
router.post(
  "/add-property",
  verifyToken,
  authorize(roles.AGENT),
  agentController.addProperty
);

export default router;
