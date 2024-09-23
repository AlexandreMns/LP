import { User, roles } from "../../models/Users.js";
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

  async allUsers() {
    try {
      const users = await User.find();
      const data = users.map((user) => {
        return {
          name: user.name,
          email: user.email,
          role: user.role,
        };
      });
      return data;
    } catch (error) {
      throw new Error("Problem in fetching users " + error);
    }
  }
}
