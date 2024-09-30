import { dataRole } from "../utils/dataUtil.js";
import { HttpStatus } from "../utils/httpStatus.js";

export class UserController {
  constructor(userServices) {
    this.userServices = userServices;
  }

  register = async (req, res) => {
    try {
      const data = {
        name: req.body.name,
        email: req.body.email,
        dateOfBirth: new Date(req.body.dateOfBirth).toISOString(), // Converte a data de nascimento para o formato ISO 8601
        password: req.body.password,
      };
      const response = await this.userServices.register(data);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const data = {
        email: req.body.email,
        password: req.body.password,
      };
      const response = await this.userServices.login(data);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };

  me = async (req, res) => {
    try {
      const response = await this.userServices.me(req.user);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };

  forgotPassword = async (req, res) => {
    try {
      const data = {
        newPassword: req.body.newPassword,
        confirmPassword: req.body.confirmPassword,
        userId: req.user,
      };
      const response = await this.userServices.forgotPassword(data);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };

  forgotPasswordToken = async (req, res) => {
    try {
      const data = {
        email: req.body.email,
      };
      const response = await this.userServices.forgotPasswordToken(data);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };

  allProperties = async (req, res) => {
    try {
      // Desestruturação dos parâmetros da query diretamente do req.query
      const {
        page = 1,
        limit = 10,
        sort = "price",
        type,
        search,
        bedrooms,
        bathrooms,
        minPrice,
        maxPrice,
        minSize,
        maxSize,
        features,
      } = req.query;

      // Passar os parâmetros para a função de serviço
      const data = {
        page,
        limit,
        sort,
        type,
        search,
        bedrooms,
        bathrooms,
        minPrice,
        maxPrice,
        minSize,
        maxSize,
        features,
      };
      // Chamada do serviço com os dados processados
      const response = await this.userServices.allProperties(data);
      res.status(HttpStatus.OK).json({ response });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };
  async addToWishlist(req, res) {
    try {
      const userId = req.user; // vê se o id do usuário está disponível no token
      const itemId = req.params.itemId;
      const note = req.body.note || ""; // Nota opcional
      const wishlist = await this.userServices.addToWishlist(userId, itemId, note);
      console.log(wishlist);
      res.status(200).json(wishlist);
    
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async removeFromWishlist(req, res) {
    try {
      const userId = req.user; // vê se o id do usuário está disponível no token
      const itemId = req.params.itemId;
      const wishlist = await this.userServices.removeFromWishlist(userId, itemId);
      res.status(200).json(wishlist);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async viewWishlist(req, res) {
    try {
      const userId = req.user; // vê se o id do usuário está disponível no token
      const wishlist = await this.userServices.viewWishlist(userId);
      res.status(200).json(wishlist);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
}