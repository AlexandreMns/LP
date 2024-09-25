import mongoose from 'mongoose';
import { User } from './usersModel.js';

const AdminSchema = new mongoose.Schema({
  // Campos específicos para Admin (se houver)
});

export const Admin = User.discriminator('Admin', AdminSchema);