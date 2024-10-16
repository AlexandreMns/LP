import { Property } from "../../models/propertyModel.js";
import { createProperty, dataRole } from "../../utils/dataUtil.js";

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

}
