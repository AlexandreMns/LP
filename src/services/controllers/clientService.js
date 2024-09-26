import { User } from '../../models/usersModel.js';

export class ClientService {
  async getProfile(userId) {
    const client = await User.findById(userId);
    if (!client) {
      throw new Error('Client not found');
    }
    return client;
  }

  async updateProfile(userId, profileData) {
    const client = await User.findByIdAndUpdate(userId, profileData, { new: true });
    if (!client) {
      throw new Error('Client not found');
    }
    return client;
  }
}