import express from 'express';


import { ClientService } from '../../services/controllers/clientService.js';



const router = express.Router();
const clientService = new ClientService();
// Remove the redundant declaration of clientController
// const clientController = new ClientController(clientService);

export default router;