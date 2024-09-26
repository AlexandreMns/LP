import mongoose from "mongoose";

const roles = {
  USER: "user",
  MODERATOR: "moderator",
  ADMIN: "admin",
};

const roleHierarchy = {
  [roles.USER]: 1,
  [roles.MODERATOR]: 2,
  [roles.ADMIN]: 3,
};

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: { type: String, enum: Object.values(roles), default: roles.USER },
  resetPasswordToken: {
    type: String,
  },
});

const User = mongoose.model("User", UserSchema);

export { User, roles, roleHierarchy };
