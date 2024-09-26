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
      const response = await this.userServices.forgotPasswordToken(req.user);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };
}