import mongoose from 'mongoose';
import { User } from './usersModel.js';

const AgentSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  agentLicense: { type: String, required: true },
  employer: { type: String, required: true },
  properties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
});

export const Agent = User.discriminator('Agent', AgentSchema);