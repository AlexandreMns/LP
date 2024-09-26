import mongoose from "mongoose";
import { User, roles } from "../models/usersModel.js";

export const isValid = (ObjectId) => {
  const isValid = mongoose.Types.ObjectId.isValid(ObjectId);
  return isValid;
};

export const dataRole = async (id) => {
  const user = await User.findById(id);
  if (!User) {
    return "User not found";
  }
  try {
    if (roles.CLIENT === user.role) {
      const data = {
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        phone: user.phone,
        role: user.role,
      };
      console.log(data);
      return data;
    } else if (roles.AGENT === user.role) {
      const data = {
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        phone: user.phone,
        role: user.role,
        agentLicense: user.agentLicense,
        employer: user.employer,
        properties: user.properties,
      };
      console.log(data);
      return data;
    } else if (roles.ADMIN === user.role) {
      const data = {
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        phone: user.phone,
        role: user.role,
        agentLicense: user.agentLicense,
        employer: user.employer,
        properties: user.properties,
      };
      console.log(data);
      return data;
    }
  } catch (error) {
    throw new Error("Problem in the dataRole " + error);
  }
};
