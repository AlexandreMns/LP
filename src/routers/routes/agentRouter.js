import express from 'express';
import { AgentService } from '../../services/controllers/agentService.js';
import { AgentController } from '../../controllers/agentController.js';
import { verifyToken } from '../../middlewares/verifyToken.js';

const router = express.Router();
const agentService = new AgentService();
const agentController = new AgentController(agentService);

// Rotas específicas para Agentes
router.get('/profile', verifyToken, agentController.getProfile);
router.put('/profile', verifyToken, agentController.updateProfile);
router.get('/properties', verifyToken, agentController.getProperties);

export default router;