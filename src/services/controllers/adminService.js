import { User } from "../../models/usersModel.js";
import { dataRole } from "../../utils/dataUtil.js";

export class AdminService {
  async allUsers() {
    try {
      const users = await User.find();
      const payload = users.map((user) => {
        return {
          id: user._id,
          name: user.name,
          dateOfBirth: user.dateOfBirth,
          email: user.email,
          role: user.role,
          phone: user.phone,
          agentLicense: user.agentLicense,
          employer: user.employer,
          properties: user.properties,
        };
      });
      return payload;
    } catch (error) {
      throw new Error("Problem in fetching users " + error);
    }
  }

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
    // Exemplo de lógica para obter dados do dashboard
    //Mudar muita coisa aqui
    const totalUsers = await User.countDocuments();
    const totalImoveis = await Imovel.countDocuments();
    const totalClientes = await User.countDocuments({ role: "client" });
    const totalAgentes = await User.countDocuments({ role: "agent" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    return {
      totalUsers,
      totalImoveis,
      totalClientes,
      totalAgentes,
      totalAdmins,
    };
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
}
