import express from 'express';
import { ClientService } from '../services/clientService.js';
import { ClientController } from '../controllers/clientController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
const clientService = new ClientService();
const clientController = new ClientController(clientService);

// Routes specific to Clients
router.get('/profile', verifyToken, clientController.getProfile);
router.put('/profile', verifyToken, clientController.updateProfile);

export default router;