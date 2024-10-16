import { roles, User } from "../../models/usersModel.js";
import { Property } from "../../models/propertyModel.js";
import { dataRole } from "../../utils/dataUtil.js";
import { createPassword } from "../../utils/passwordUtil.js";

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
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const totalClientes = await User.countDocuments({ role: "client" });
    const totalAgentes = await User.countDocuments({ role: "agent" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    return {
      totalUsers,
      totalProperties,
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
        throw new Error('User not found');
      }
      return "User deleted successfully"
    } catch (error) {
      throw new Error ('Problem in deleting user ' + error);
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
      const skip = (data.page - 1) * data.limit;

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

      const users = await User.find(filter)
        .skip(skip)
        .limit(Number(data.limit)); // Aplicar paginação
      const total = await User.countDocuments(filter); // Total de usuários filtrados

      const payload = await Promise.all(
        users.map((user) => dataRole(user._id)) // Buscar dados do papel para cada usuário
      );
      return {
        data: payload,
        total,
        page: Number(data.page),
        limit: Number(data.limit),
        pages: Math.ceil(total / data.limit),
      };
    } catch (error) {
      throw new Error("Problem in fetching users " + error);
    }
  }

  async getUserById(data) {
    try{
      const user = await User.findById(data);
      if(!user){
        return "User not found";
      }
      return user;
    }catch(error){
      throw new Error("Problem in fetching user by id " + error);
    }
  }
}
