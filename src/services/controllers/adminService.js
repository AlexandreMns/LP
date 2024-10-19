import { roles, User } from "../../models/usersModel.js";
import { Property } from "../../models/propertyModel.js";
import { dataRole } from "../../utils/dataUtil.js";
import { Report } from "../../models/reportModel.js";
import { AgentLicense } from "../../models/agentLicense.js";
import { createPassword } from "../../utils/passwordUtil.js";
import { parse } from "dotenv";

export class AdminService {
  async changeRoles(data) {
    try {
      const userId = data.userId;
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return "User not found";
      }
      const newRole = data.newRole;
      if (newRole === user.role) {
        return "User already has this role";
      }

      user.role = newRole;
      await user.save();
      return "Role changed successfully";
    } catch (error) {
      throw new Error("Problem in changing roles " + error);
    }
  }

  async getDashboardData() {
    //Mudar muita coisa aqui
    try {
      const [
        totalUsers,
        totalProperties,
        totalReports,
        totalAgentLicenses,
        totalAdmins,
        totalAgentes,
        totalClientes,
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: roles.CLIENT }),
        User.countDocuments({ role: roles.AGENT }),
        User.countDocuments({ role: roles.ADMIN }),
        Property.countDocuments(),
        Report.countDocuments(),
        AgentLicense.countDocuments(),
      ]);

      return {
        totalUsers,
        totalProperties,
        totalClientes,
        totalReports,
        totalAgentLicenses,
        totalAgentes,
        totalAdmins,
      };
    } catch (error) {
      throw new Error("Problem in fetching dashboard data " + error);
    }
  }

  async createUser(userData) {
    //Mudar muita coisa aqui
    const newUser = new User(userData);
    await newUser.save();
    return newUser;
  }

  async deleteUser(userId) {
    try {
      const result = await User.deleteOne({ _id: userId });
      if (result.deletedCount === 0) {
        throw new Error("User not found");
      }
      return "User deleted successfully";
    } catch (error) {
      throw new Error("Problem in deleting user " + error);
    }
  }

  async getUser(data) {
    try {
      const userId = data.userId;
      const user = await User.findById(userId);
      if (!user) {
        return "User not found";
      }
      const payload = dataRole(userId);
      return payload;
    } catch (error) {
      throw new Error("Problem in fetching user info " + error);
    }
  }

  async createAdmin(data) {
    try {
      const password = data.password;
      const hashPassword = await createPassword(password);
      data.password = hashPassword;
      const user = await User.findOne({ email: data.email });
      if (user) {
        return "User already exists"; // mesmo com este erro da 201 corrigir para 409
      }
      const roleAdd = {
        role: roles.ADMIN,
      };
      const newData = Object.assign(data, roleAdd);
      const newAdmin = new User(newData);
      await newAdmin.save();
      return dataRole(newAdmin);
    } catch (error) {
      throw new Error("Problem in creating admin " + error);
    }
  }

  async allUsers(data) {
    try {
      const filter = {};

      if (data.role) {
        filter.role = data.role; // Filtrar por papel se fornecido
      }
      if (data.search) {
        filter.$or = [
          { name: { $regex: data.search, $options: "i" } },
          { email: { $regex: data.search, $options: "i" } },
        ];
      }

      // Conta o número total de propriedades que correspondem aos filtros
      const total = await User.countDocuments(filter);

      // Calcula o número total de páginas
      const totalPages = Math.ceil(total / data.limit);

      // Verifica se a página solicitada é maior que o número de páginas disponíveis
      if (data.page > totalPages) {
        // Redireciona para a última página disponível
        data.page = totalPages;
      }

      // Verifica se o número da página é menor que 1
      if (data.page < 1) {
        data.page = 1; // Redireciona para a primeira página
      }

      const users = await User.find(filter)
        .skip((data.page - 1) * data.limit) // Pular documentos
        .limit(parseInt(data.limit)); // Aplicar paginação

      const payload = await Promise.all(
        users.map((user) => dataRole(user._id)) // Buscar dados do papel para cada usuário
      );
      return {
        payload,
        total,
        page: parseInt(data.page),
        pages: Math.ceil(total / data.limit),
      };
    } catch (error) {
      throw new Error("Problem in fetching users " + error);
    }
  }

  async getUserById(data) {
    try {
      const user = await User.findById(data);
      if (!user) {
        return "User not found";
      }
      return user;
    } catch (error) {
      throw new Error("Problem in fetching user by id " + error);
    }
  }
}
