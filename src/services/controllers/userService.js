import { User, roles } from "../../models/usersModel.js";
import { tokenPasswordReset } from "../../middlewares/verifyToken.js";
import { Wishlist } from "../../models/wishlistModel.js";
import {
  createToken,
  createTokenPasswordReset,
} from "../../utils/tokenUtil.js";
import { dataRole } from "../../utils/dataUtil.js";
import { comparePassword, createPassword } from "../../utils/passwordUtil.js";
import config from "../../../config.js";

export class UserService {
  async register(data) {
    try {
      const password = data.password;
      const hashPassword = await createPassword(password);

      const userExists = await User.findOne({ email: data.email });
      if (userExists) {
        return "User already exists";
      }

      const wishlist = new Wishlist({
        items: [],
        total: 0,
      });

      const user = new User({
        name: data.name,
        email: data.email,
        password: hashPassword,
        role: roles.USER,
        wishlist: wishlist,
      });

      await user.save();
      await wishlist.save();

      const token = createToken(user);
      const userToken = {
        token: token.token,
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
      const passwordIsValid = await comparePassword(
        data.password,
        user.password
      );
      if (!passwordIsValid) {
        return "Invalid password";
      }
      const token = createToken(user, config.expiresIn);
      const userToken = {
        token: token.token,
      };
      return userToken;
    } catch (error) {
      throw new Error("Problem in the login " + error);
    }
  }

  async me(data) {
    try {
      const userId = data;
      const user = await User.findById(userId);
      if (!user) {
        return "User not found";
      }
      const payload = dataRole(userId);
      return payload;
    } catch (error) {
      throw new Error("Problem in fetching user " + error);
    }
  }

  async forgotPassword(data) {
    try {
      const userId = data.userId;
      const user = await User.findById(userId);

      if (user.resetPasswordToken === undefined) {
        return "No token found";
      }
      const verifycation = await tokenPasswordReset(user.resetPasswordToken);
      if (!verifycation) {
        return "Token expired";
      }

      const newPassword = data.newPassword;
      const confirmPassword = data.confirmPassword;

      if (newPassword !== confirmPassword) {
        return "Passwords do not match";
      }

      const oldPassword = await comparePassword(newPassword, user.password);
      if (oldPassword) {
        return "New password cannot be the same as the old password";
      }

      try {
        user.password = await createPassword(newPassword);
        user.resetPasswordToken = undefined;

        await user.save();
        return "Password updated successfully";
      } catch (err) {
        throw new Error("Problem in updating password " + err);
      }
    } catch (error) {
      throw new Error("Problem in forgot password " + error);
    }
  }

  async forgotPasswordToken(data) {
    try {
      const userEmail = data.email;
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        return "User not found";
      }
      user.resetPasswordToken = createTokenPasswordReset(user);
      await user.save();
      const token = {
        token: user.resetPasswordToken,
      };
      return token;
    } catch (error) {
      throw new Error("Problem in forgot password token " + error);
    }
  }

  async userById(data) {
    try {
      const userId = data;
      const user = await User.findById(userId);
      if (!user) {
        return "User not found";
      }
      const payload = dataRole(userId);
      return payload;
    } catch (error) {
      throw new Error("Problem in fetching user " + error);
    }
  }

  async updateUser(data) {
    try {
      const userId = data.userId;

      // Busca o usuário pelo ID
      const user = await User.findById(userId);
      if (!user) {
        return "User not found";
      }

      let isUpdated = false; // Flag para verificar se algum campo foi atualizado

      // Verifica se o e-mail está sendo atualizado
      if (data.email) {
        if (data.email === user.email) {
          return "The provided email is already the current email.";
        }
        const existingUserWithEmail = await User.findOne({
          email: data.email,
          _id: { $ne: userId },
        });
        if (existingUserWithEmail) {
          return "Email is already in use by another user";
        }
        user.email = data.email;
        isUpdated = true;
      }

      // Verifica se o telefone está sendo atualizado
      if (data.phone) {
        if (data.phone === user.phone) {
          return "The provided phone number is already the current phone number.";
        }
        const existingUserWithPhone = await User.findOne({
          phone: data.phone,
          _id: { $ne: userId },
        });
        if (existingUserWithPhone) {
          return "Phone number is already in use by another user";
        }
        user.phone = data.phone;
        isUpdated = true;
      }

      // Atualiza o nome apenas se estiver presente no 'data'
      if (data.name) {
        if (data.name === user.name) {
          return "The provided name is already the current name.";
        }
        user.name = data.name;
        isUpdated = true;
      }

      // Verifica se algo foi atualizado
      if (isUpdated) {
        await user.save(); // Salva o usuário apenas se houver mudanças
        return "User updated successfully";
      } else {
        return "No changes detected, user not updated.";
      }
    } catch (error) {
      throw new Error("Problem in updating user: " + error);
    }
  }
  /*
  async deleteUser(data) {
    try {
      const userId = data;
      const user = await User.findById(userId);
      if (!user) {
        return "User not found";
      }
      return;
    } catch (error) {
      throw new Error("Problem in deleting user " + error);
    }
  }*/
}
