import { User, roles } from "../models/usersModel.js";
import { Report } from "../models/reportModel.js";
import { AgentLicense } from "../models/agentLicense.js";
import { Wishlist } from "../models/wishlistModel.js";
import { Property } from "../models/propertyModel.js";

export const IDfinder = async (id) => {
  // Consultas simultâneas
  const [userById, propertyById, reportById, wishlistById, agentLicenseById] =
    await Promise.all([
      User.findById(id),
      Property.findById(id),
      Report.findById(id),
      Wishlist.findById(id),
      AgentLicense.findById(id),
    ]);

  // Se o ID for de um usuário (Cliente ou Agente)
  if (userById) {
    if (userById.role === "client") {
      return { type: "client", id: userById._id };
    }
    if (userById.role === "agent") {
      return { type: "agent", id: userById._id };
    }
    if (userById.role === "admin") {
      return { type: "admin", id: userById._id };
    }
  }
  // Se o ID for de uma propriedade
  else if (propertyById) {
    return { type: "property", id: propertyById._id };
  }
  // Se o ID for de um relatório
  else if (reportById) {
    return { type: "report", id: reportById._id };
  }
  // Se o ID for de uma lista de desejos
  else if (wishlistById) {
    return { type: "wishlist", id: wishlistById._id };
  }
  // Se o ID for de uma licença de agente
  else if (agentLicenseById) {
    return { type: "agentLicense", id: agentLicenseById._id };
  }

  // Se o ID não corresponder a nenhum dos tipos acima
  return "No matching entity found with the given ID";
};
