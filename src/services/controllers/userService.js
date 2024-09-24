import { User, roles } from "../../models/usersModel.js";
import bcrypt from "bcrypt";
import { createToken } from "../../utils/tokenUtil.js";
import config from "../../../config.js";

export class UserService {
  async register(data) {
    try {
      const password = data.password;
      const hashPassword = await bcrypt.hash(password, config.saltRounds);

      const userExists = await User.findOne({ email: data.email });
      if (userExists) {
        return "User already exists";
      }

      const user = new User({
        name: data.name,
        email: data.email,
        password: hashPassword,
        role: roles.USER,
      });
      await user.save();
      const token = createToken(user, config.expiresIn);
      const userToken = {
        token: token.token,
        role: user.role,
      };
      return userToken;
    } catch (error) {
      throw new Error("Problem in the registration " + error);
    }
  }

  async login(data) {
    try {
      const user = await User.findOne({ email: data.email }).select(
        "+password"
      );
      if (!user) {
        return "User not found";
      }
      const passwordIsValid = await bcrypt.compare(
        data.password,
        user.password
      );
      if (!passwordIsValid) {
        return "Invalid password";
      }
      const token = createToken(user, config.expiresIn);
      const userToken = {
        token: token.token,
        role: user.role,
      };
      return userToken;
    } catch (error) {
      throw new Error("Problem in the login " + error);
    }
  }

  async allUsers(data) {
    try {
      console.log(data);
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

  async me(data) {
    try {
      const userId = data;
      const user = await User.findById(userId);
      // Questionavel if
      if (!user) {
        return "User not found";
      }
      const payload = {
        name: user.name,
        email: user.email,
        role: user.role,
      };
      return payload;
    } catch (error) {
      throw new Error("Problem in fetching user " + error);
    }
  }
  //Forgot password needs to be fixed, it needs to work via a token send in the email
  async forgotPassword(data) {
    try {
      const userId = data.userId;
      const user = await User.findOne({ _id: userId });
      const newPassword = data.newPassword;
      const confirmPassword = data.confirmPassword;

      console.log(newPassword, +"   " + confirmPassword);

      if (newPassword !== confirmPassword) {
        return "Passwords do not match";
      }

      const oldPassword = await bcrypt.compare(newPassword, user.password);
      if (oldPassword) {
        return "New password cannot be the same as the old password";
      }

      try {
        user.password = await bcrypt.hash(newPassword, config.saltRounds);
        /* Make sure to remove the reset password token and expiry date
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        */
        await user.save();
        return "Password updated successfully";
      } catch (err) {
        throw new Error("Problem in updating password " + err);
      }
    } catch (error) {
      throw new Error("Problem in forgot password " + error);
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
