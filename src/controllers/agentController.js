import { HttpStatus } from "../utils/httpStatus.js";
import { User, roles } from "../models/usersModel.js";
import { AgentLicense } from "../models/agentLicense.js";

export class AgentController {
  constructor(agentService) {
    this.agentService = agentService;
  }

  getProperties = async (req, res) => {
    try {
      const data = req.user;
      const properties = await this.agentService.getProperties(data);
      res.status(HttpStatus.OK).json(properties);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  };

  createAgentLicense = async (req, res) => {
    try {
      const userId = req.user; // Usuário autenticado via token
      const {
        agentId,
        licenseNumber,
        issueDate,
        expiryDate,
        issuingEntity,
        licenseStatus,
      } = req.body; // Dados da licença e ID do agente

      // Verifica se o usuário tem o papel de 'admin'
      const adminUser = await User.findById(userId);
      if (!adminUser || adminUser.role !== roles.ADMIN) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: "User is not an admin" });
      }

      // Busca o agente pelo ID fornecido no corpo da requisição
      const agentUser = await User.findById(agentId);
      if (!agentUser) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: "Agent not found" });
      }

      // Verifica se o agente já possui uma licença
      if (agentUser.agentLicense) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Agent already has a license" });
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
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  };

  deleteAgentLicense = async (req, res) => {
    try {
      const userId = req.user; // Usuário autenticado via token
      const { agentId } = req.body; // ID do agente vindo do corpo da requisição (raw)

      // Verifica se o usuário tem o papel de 'admin'
      const adminUser = await User.findById(userId);
      if (!adminUser || adminUser.role !== roles.ADMIN) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: "User is not an admin" });
      }

      // Busca o agente pelo ID fornecido no corpo da requisição
      const agentUser = await User.findById(agentId);
      if (!agentUser) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: "Agent not found" });
      }

      // Verifica se o agente possui uma licença
      if (!agentUser.agentLicense) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Agent does not have a license" });
      }

      // Remove a licença de agente
      await AgentLicense.findByIdAndDelete(agentUser.agentLicense);

      // Remove a referência da licença no documento do agente
      agentUser.agentLicense = null;
      await agentUser.save();

      res.status(HttpStatus.NO_CONTENT).send(); // Retorna 204 No Content para indicar sucesso
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  };

  // Método para buscar a licença de um agente pelo token (logado)
  getAgentLicense = async (req, res) => {
    try {
      const userId = req.user; // Usuário autenticado via token

      // Verifica se o usuário tem o papel de 'agent'
      const user = await User.findById(userId);
      if (!user || user.role !== roles.AGENT) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: "User is not an agent" });
      }

      // Verifica se o agente possui uma licença
      if (!user.agentLicense) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: "Agent does not have a license" });
      }

      const agentLicense = await AgentLicense.findById(user.agentLicense);

      res.status(HttpStatus.OK).json(agentLicense);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  };

  getAllAgentLicenses = async (req, res) => {
    try {
      const userId = req.user; // Usuário autenticado via token

      // Verifica se o usuário tem o papel de 'admin'
      const user = await User.findById(userId);
      if (!user || user.role !== roles.ADMIN) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: "User is not an admin" });
      }

      const agentLicenses = await AgentLicense.find();

      res.status(HttpStatus.OK).json(agentLicenses);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  };

  async getAllAgentLicenses() {
    const licenses = await AgentLicense.find();
    return licenses;
  }
}
