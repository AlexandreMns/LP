import mongoose from "mongoose";
import { User, roles } from "../models/usersModel.js";
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

export const reportPagination = async (data) => {
  try {
    // Encontra o usuário logado pelo ID
    const user = await User.findById(data.user);
    if (!user) {
      return "User not found";
    }

    // Define o filtro base para relatórios
    let filter = {};

    // Se o data.id for fornecido, verifica se é um User (Cliente ou Agente) ou uma Property
    if (data.id) {
      const userById = await User.findById(data.id);
      const propertyById = await Property.findById(data.id);

      // Se o ID for de um usuário (Cliente ou Agente)
      if (userById) {
        if (userById.role === "client") {
          filter.client = userById._id; // Se for um cliente, filtra por cliente
        }
        if (userById.role === "agent") {
          filter.agent = userById._id; // Se for um agente, filtra por agente
        }
      }
      // Se o ID for de uma propriedade
      else if (propertyById) {
        filter.property = propertyById._id; // Filtro por propriedade
      }
      // Se o ID não corresponder a nenhum usuário ou propriedade
      else {
        return "No user or property found with the given ID";
      }
    } else {
      // Se não houver data.id, filtra de acordo com o papel do usuário logado

      // Se o usuário logado for cliente
      if (user.role === "client") {
        filter.client = user._id; // O cliente só vê seus próprios relatórios
      }

      // Se o usuário logado for agente
      else if (user.role === "agent") {
        filter.agent = user._id; // O agente só vê seus próprios relatórios
      }
    }

    // Consulta com paginação e filtros
    const reports = await Report.find(filter)
      .skip((data.page - 1) * data.limit)
      .limit(data.limit);

    // Verifica se relatórios foram encontrados
    if (reports.length === 0) {
      return "No reports found";
    }

    // Conta o total de relatórios para paginação
    const totalReports = await Report.countDocuments(filter);

    // Retorna os relatórios paginados e o total de resultados
    return {
      reports,
      totalReports,
      totalPages: Math.ceil(totalReports / data.limit),
      currentPage: data.page,
    };
  } catch (error) {
    throw new Error("Error fetching reports: " + error.message);
  }
};
