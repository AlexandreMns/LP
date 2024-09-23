import mongoose from "mongoose";

const roles = {
  USER: "user",
  MODERATOR: "moderator",
  ADMIN: "admin",
};

const roleHierarchy = {
  user: 1,
  moderator: 2,
  admin: 3,
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
});

const User = mongoose.model("User", UserSchema);

export { User, roles, roleHierarchy };
