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
}
