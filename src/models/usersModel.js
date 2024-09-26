import mongoose from 'mongoose';

const roles = {
  CLIENT: 'client',
  AGENT: 'agent',
  ADMIN: 'admin',
};

const roleHierarchy = {
  [roles.CLIENT]: 1,
  [roles.AGENT]: 2,
  [roles.ADMIN]: 3,
};

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(roles), required: true, default: roles.CLIENT },
  phone: { type: String },
  agentLicense: { type: String },
  employer: { type: String },
  properties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
}, { discriminatorKey: 'role' });

const User = mongoose.model('User', UserSchema);

export { User, roles, roleHierarchy };