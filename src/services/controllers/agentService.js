import { Property } from "../../models/propertyModel.js";
import { createProperty, dataRole } from "../../utils/dataUtil.js";

export class AgentService {
  async getProperties(agentId) {
    const properties = await Property.find({ agent: agentId });
    return properties;
  }

  async addProperty(data) {
    try {
      const property = await createProperty(data);
      return property;
    } catch (error) {
      throw new Error("Problem in the addProperty " + error);
    }
  }
}
