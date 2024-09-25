import mongoose from 'mongoose';
import { User } from './usersModel.js';

const ClientSchema = new mongoose.Schema({
  dateOfBirth: { type: Date, required: true },
});

export const Client = User.discriminator('Client', ClientSchema);