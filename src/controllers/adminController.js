import { isValid } from "../utils/dataUtil.js";
import { HttpStatus } from "../utils/httpStatus.js";

export class AdminController {
  constructor(adminController) {
    this.adminController = adminController;
  }

  changeRoles = async (req, res) => {
    try {
      const data = {
        userId: req.body.userId,
        newRole: req.body.newRole,
      };
      const validation = isValid(data.userId);
      if (!validation) {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: "Invalid ID" });
      }
      const response = await this.adminController.changeRoles(data);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };

  getDashboard = async (req, res) => {
    try {
      const dashboardData = await this.adminController.getDashboardData();
      res.status(200).json(dashboardData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  createUser = async (req, res) => {
    try {
      const userData = req.body;
      const newUser = await this.adminController.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const response = await this.adminController.deleteUser(userId);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  updateUser = async (req, res) => {
    try {
      const data = {
        userId: req.params.userId,
        userData: req.body,
      };
      const response = isValid(data.userId);
      if (!response) {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: "Invalid ID" });
      }
      const updatedUser = await this.adminController.updateUser(data);
      res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  };

  getUser = async (req, res) => {
    try {
      const data = {
        userId: req.params.userId,
      };
      const validation = isValid(data.userId);
      if (!validation) {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: "Invalid ID" });
      }
      const user = await this.adminController.getUser(data);
      res.status(HttpStatus.OK).json(user);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  };

  createAdmin = async (req, res) => {
    try {
      const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        dateOfBirth: req.body.dateOfBirth,
      };
      const response = await this.adminController.createAdmin(data);
      res.status(HttpStatus.CREATED).json(response);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  };

  allUsers = async (req, res) => {
    try {
      const data = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        role: req.query.role,
        search: req.query.search,
      };
      const response = await this.adminController.allUsers(data);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };
}

export default AdminController;
