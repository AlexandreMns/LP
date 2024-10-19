import mongoose from "mongoose";
import { User, roles } from "../models/usersModel.js";
import { IDfinder } from "./idFinder.js";
import { Report } from "../models/reportModel.js";
import { Property, type } from "../models/propertyModel.js";

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
        id: user._id,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        phone: user.phone,
        role: user.role,
      };
      return data;
    } else if (roles.AGENT === user.role) {
      const data = {
        id: user._id,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        phone: user.phone,
        role: user.role,
        agentLicense: user.agentLicense,
        employer: user.employer,
        properties: user.properties,
      };
      return data;
    } else if (roles.ADMIN === user.role) {
      const data = {
        id: user._id,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        phone: user.phone,
        role: user.role,
        agentLicense: user.agentLicense,
        employer: user.employer,
        properties: user.properties,
      };
      return data;
    }
  } catch (error) {
    throw new Error("Problem in the dataRole " + error);
  }
};

export const createProperty = async (data) => {
  try {
    if (!Object.values(type).includes(data.type)) {
      return "Invalid type";
    }
    if (!isValid(data.agent)) {
      return "Invalid agent";
    }
    if (data.type === type.LAND) {
      delete data.bedrooms;
      delete data.bathrooms;
    }

    data.agent = data.agent;
    const property = new Property({ ...data, agent: data.agent });
    await property.save();
    return property;
  } catch (error) {
    throw new Error("Problem in the createProperty " + error);
  }
};
