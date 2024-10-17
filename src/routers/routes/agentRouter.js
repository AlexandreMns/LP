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

router.get(
  "/own-properties",
  verifyToken,
  authorize(roles.AGENT),
  agentController.getProperties
);

router.post("/license", verifyToken, authorize(roles.ADMIN), agentController.createAgentLicense);

//pelo token do usuário, pega a licença do agente
router.get("/license", verifyToken, authorize(roles.AGENT), agentController.getAgentLicense);

router.delete("/license", verifyToken, authorize(roles.ADMIN), agentController.deleteAgentLicense);

router.get("/licenses", verifyToken, authorize(roles.ADMIN), agentController.getAllAgentLicenses);


export default router;
