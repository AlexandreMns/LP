import { User, roles } from "../../models/usersModel.js";
import { tokenPasswordReset } from "../../middlewares/verifyToken.js";
import {
  createToken,
  createTokenPasswordReset,
} from "../../utils/tokenUtil.js";
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

      const user = new User({
        name: data.name,
        email: data.email,
        password: hashPassword,
        role: roles.USER,
      });
      await user.save();
      const token = createToken(user);
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
        role: user.role,
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
      // Questionable if
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
  //
  //Forgot password needs to be fixed, it needs to work via a token send in the email
  //
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
      //Temporario
      const token = {
        token: user.resetPasswordToken,
      };
      return token;
      // return "Token sent to email";
    } catch (error) {
      throw new Error("Problem in forgot password token " + error);
    }
  }

  //
  //
  //
}
