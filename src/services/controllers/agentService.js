import { User } from '../models/usersModel.js';
import { Property } from '../models/propertyModel.js';

export class AgentService {
  async getProfile(userId) {
    const agent = await User.findById(userId);
    if (!agent) {
      throw new Error('Agent not found');
    }
    return agent;
  }

  async updateProfile(userId, profileData) {
    const agent = await User.findByIdAndUpdate(userId, profileData, { new: true });
    if (!agent) {
      throw new Error('Agent not found');
    }
    return agent;
  }

  async getProperties(agentId) {
    const properties = await Property.find({ agent: agentId });
    return properties;
  }
}