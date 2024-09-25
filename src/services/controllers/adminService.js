import { User } from "../../models/usersModel.js";

export class AdminService {
  async allUsers(data) {
    try {
      const users = await User.find();
      const payload = users.map((user) => {
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
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
      console.log(newRole);

      user.role = newRole;
      await user.save();
      console.log(user);
      return "Role changed successfully";
    } catch (error) {
      throw new Error("Problem in changing roles " + error);
    }
  }

  async getDashboardData() {
    // Exemplo de lógica para obter dados do dashboard
    const totalUsers = await User.countDocuments();
    const totalImoveis = await Imovel.countDocuments();
    const totalClientes = await User.countDocuments({ role: 'client' });
    const totalAgentes = await User.countDocuments({ role: 'agent' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    return {
      totalUsers,
      totalImoveis,
      totalClientes,
      totalAgentes,
      totalAdmins,
    };
  }

  async createUser(userData) {
    const newUser = new User(userData);
    await newUser.save();
    return newUser;
  }

  async deleteUser(userId) {
    const result = await User.deleteOne({ _id: userId });
    if (result.deletedCount === 0) {
      throw new Error('User not found');
    }
    return { message: 'User deleted successfully' };
  }

}
