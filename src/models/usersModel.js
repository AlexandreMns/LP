import mongoose from 'mongoose';

const roles = {
  CLIENT: 'client',
  AGENT: 'agent',
  ADMIN: 'admin',
};



const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // email must be unique
  },
    password: {
    type: String,
    required: true,
  },
  role: { type: String, enum: Object.values(roles), default: roles.CLIENT },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

const User = mongoose.model("User", UserSchema);

export { User, roles };
