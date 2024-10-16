import { HttpStatus } from "../utils/httpStatus.js";
import { User, roles } from "../models/usersModel.js";

export class AgentController {
  constructor(agentService) {
    this.agentService = agentService;
  }

  getProperties = async (req, res) => {
    try {
      const data = req.user;
      const properties = await this.agentService.getProperties(data);
      res.status(200).json(properties);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  createAgentLicense = async (req, res) => {
    try {
      const userId = req.user; // Usuário autenticado via token
      const { agentId, licenseNumber, issueDate, expiryDate, issuingEntity, licenseStatus } = req.body; // Dados da licença e ID do agente
  
      // Verifica se o usuário tem o papel de 'admin'
      const adminUser = await User.findById(userId);
      if (!adminUser || adminUser.role !== roles.ADMIN) {
        return res.status(HttpStatus.FORBIDDEN).json({ message: "User is not an admin" });
      }
  
      // Busca o agente pelo ID fornecido no corpo da requisição
      const agentUser = await User.findById(agentId);
      if (!agentUser) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: "Agent not found" });
      }
  
      // Verifica se o agente já possui uma licença
      if (agentUser.agentLicense) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "Agent already has a license" });
      }
  
      // Cria uma nova licença de agente
      const agentLicense = new AgentLicense({
        licenseNumber,
        issueDate,
        expiryDate,
        issuingEntity,
        licenseStatus,
        holder: agentUser._id, // Associa a licença ao agente
      });
  
      await agentLicense.save();
  
      // Associa a licença ao agente
      agentUser.agentLicense = agentLicense._id;
      await agentUser.save();
  
      res.status(HttpStatus.CREATED).json(agentLicense); // Retorna a nova licença criada
      
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  };
  

  deleteAgentLicense = async (req, res) => {
    try {
      const userId = req.user; // Usuário autenticado via token
      const agentId = req.query.agentId; // ID do agente vindo dos parâmetros de query
  
      // Verifica se o usuário tem o papel de 'admin'
      const adminUser = await User.findById(userId);
      if (!adminUser || adminUser.role !== roles.ADMIN) {
        return res.status(HttpStatus.FORBIDDEN).json({ message: "User is not an admin" });
      }
  
      // Busca o agente pelo ID fornecido no parâmetro de query
      const agentUser = await User.findById(agentId);
      if (!agentUser) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: "Agent not found" });
      }
  
      // Verifica se o agente possui uma licença
      if (!agentUser.agentLicense) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "Agent does not have a license" });
      }
  
      // Remove a licença de agente
      await AgentLicense.findByIdAndDelete(agentUser.agentLicense);
  
      // Remove a referência da licença no documento do agente
      agentUser.agentLicense = null;
      await agentUser.save();
  
      res.status(HttpStatus.NO_CONTENT).send(); // Retorna 204 No Content para indicar sucesso
      
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  };

  

}
