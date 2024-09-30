import { User, roles } from "../../models/usersModel.js";
import { tokenPasswordReset } from "../../middlewares/verifyToken.js";
import {
  createToken,
  createTokenPasswordReset,
} from "../../utils/tokenUtil.js";
import { dataRole } from "../../utils/dataUtil.js";
import { comparePassword, createPassword } from "../../utils/passwordUtil.js";
import config from "../../../config.js";
import { Property } from "../../models/propertyModel.js";

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
        dateOfBirth: data.dateOfBirth,
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
      const payload = dataRole(userId);
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

  async allProperties(data) {
    try {
      const query = {};

      // Filtra por tipo de propriedade (house, apartment, land)
      if (data.type) {
        query.type = data.type;
      }

      // Filtra por número de quartos
      if (data.bedrooms) {
        query.bedrooms = parseInt(data.bedrooms);
      }

      // Filtra por número de casas de banho
      if (data.bathrooms) {
        query.bathrooms = parseInt(data.bathrooms);
      }

      // Filtro de preço
      if (data.minPrice || data.maxPrice) {
        query.price = {};
        if (data.minPrice) query.price.$gte = parseInt(data.minPrice); // Preço maior ou igual ao mínimo
        if (data.maxPrice) query.price.$lte = parseInt(data.maxPrice); // Preço menor ou igual ao máximo
      }

      // Filtro de tamanho
      if (data.minSize || data.maxSize) {
        query.size = {};
        if (data.minSize) query.size.$gte = parseInt(data.minSize); // Tamanho maior ou igual ao mínimo
        if (data.maxSize) query.size.$lte = parseInt(data.maxSize); // Tamanho menor ou igual ao máximo
      }

      // Filtro por atributos em `features` (booleanos como airConditioning, pool, etc.)
      if (data.features) {
        const featuresArray = data.features.split(","); // Exemplo: ?features=airConditioning,pool
        featuresArray.forEach((feature) => {
          query[`features.${feature}`] = true; // Verifica se o atributo no features é true
        });
      }

      // Pesquisa com regex (por exemplo, em description, street ou city)
      if (data.search) {
        const regex = new RegExp(data.search, "i"); // "i" para case-insensitive
        query.$or = [
          { description: regex },
          { street: regex },
          { city: regex },
          { parish: regex },
        ];
      }
      // Definir ordenação apenas se o `sort` for válido
      const options = {};
      if (data.sort && data.sort.trim() !== "") {
        options.sort = data.sort; // Ordena apenas se sort for válido
      }

      // Paginação
      options.skip = (data.page - 1) * data.limit;
      options.limit = parseInt(data.limit);

      // Buscar propriedades com filtros e opções de ordenação
      const properties = await Property.find(query, null, options);

      // Contar o número total de propriedades que correspondem aos filtros
      const total = await Property.countDocuments(query);

      if (properties.length === 0) {
        return "No properties found";
      }

      const payload = {
        properties,
        total,
        page: parseInt(data.page),
        pages: Math.ceil(total / data.limit),
      };

      return payload;
    } catch (error) {
      throw new Error("Problem in fetching properties " + error);
    }
  }

  async addToWishlist(userId, itemId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      if (!user.wishList) {
        user.wishList = []; // Inicializa a wishList se estiver indefinida
      }
      // Verifica se o item já está na wishlist
      if (!user.wishList.includes(itemId)) {
        user.wishList.push(itemId);
      }
      await user.save();
      return user.wishList;
    } catch (error) {
      throw new Error('Problem in adding item to wishlist ' + error);
    }
  }

  // Método para remover item da wishlist
  async removeFromWishlist(userId, itemId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      if (!user.wishList) {
        user.wishList = []; // Inicializa a wishList se estiver indefinida
      }
      user.wishList = user.wishList.filter(id => id.toString() !== itemId);
      await user.save();
      return user.wishList;
    } catch (error) {
      throw new Error('Problem in removing item from wishlist ' + error);
    }
  }

  async viewWishlist(userId) {
    try {
      const user = await User.findById(userId).populate('wishList');
      if (!user) {
        throw new Error('User not found');
      }
      return user.wishList;
    } catch (error) {
      throw new Error('Problem in viewing wishlist ' + error);
    }
  }



}