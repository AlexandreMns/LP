import mongoose from "mongoose";

const roles = {
  CLIENT: "client",
  AGENT: "agent",
  ADMIN: "admin",
};

const roleHierarchy = {
  [roles.CLIENT]: 1,
  [roles.AGENT]: 2,
  [roles.ADMIN]: 3,
};

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, //User
    dateOfBirth: { type: Date, required: true }, //User
    email: { type: String, required: true, unique: true }, //User
    password: { type: String, required: true }, //User
    role: {
      type: String,
      enum: Object.values(roles),
      required: true,
      default: roles.CLIENT,
    }, //User
    resetPasswordToken: { type: String }, //User
    phone: { type: String }, //User ?
    agentLicense: { type: String }, //Agent
    employer: { type: String }, //Agent
    properties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }], //Agent
  },
  { discriminatorKey: "role" }
);

const User = mongoose.model("User", UserSchema);

export { User, roles, roleHierarchy };
