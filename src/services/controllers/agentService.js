import { Property } from "../../models/propertyModel.js";
import { createProperty, dataRole } from "../../utils/dataUtil.js";

export class AgentService {
  async getProperties(agentId) {
    const properties = await Property.find({ agent: agentId });
    return properties;
  }
}
