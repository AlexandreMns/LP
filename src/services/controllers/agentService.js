import { Property } from "../../models/propertyModel.js";
import { createProperty, dataRole } from "../../utils/dataUtil.js";
import { AgentLicense } from "../../models/agentLicense.js";

export class AgentService {
  async getProperties(agentId) {
    const properties = await Property.find({ agent: agentId });
    return properties;
  }

  async createAgentLicense(user, licenseData) {
    // Criação de uma nova licença de agente
    const agentLicense = new AgentLicense({
      ...licenseData,
      holder: user._id, // Associa a licença ao usuário
    });

    await agentLicense.save();
    return agentLicense;
  }

  async getAgentLicense(agentId) {
    // Busca a licença do agente
    const agentLicense = await AgentLicense.findById(agentId);
    if (!agentLicense) {
      throw new Error("Agent does not have a license");
    }

    return agentLicense;
  }

  async deleteAgentLicense(user) {
    // Busca a licença do agente
    const agentLicense = await AgentLicense.findById(user.agentLicense);
    if (!agentLicense) {
      throw new Error("Agent does not have a license");
    }

    // Remove a licença do agente
    await agentLicense.remove();
    return "Agent license deleted successfully";
  }
}
