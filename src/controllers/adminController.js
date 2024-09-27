import { isValid } from "../utils/dataUtil.js";
import { HttpStatus } from "../utils/httpStatus.js";

export class AdminController {
  constructor(adminService) {
    this.adminService = adminService;
  }

  allUsers = async (req, res) => {
    console.log("All users");
    try {
      const response = await this.adminService.allUsers();
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };

  changeRoles = async (req, res) => {
    try {
      const data = {
        userId: req.body.userId,
        newRole: req.body.newRole,
      };
      const response = await this.adminService.changeRoles(data);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };

  async getDashboard(req, res) {
    try {
      const dashboardData = await this.adminController.getDashboardData();
      res.status(200).json(dashboardData);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
    }
  };

  createUser = async (req, res) => {
    try {
      const userData = req.body;
      const newUser = await this.adminController.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
    }
  };

  async deleteUser(req, res) {
    try {
      const userId = req.params.userId;
      await this.adminService.deleteUser(userId);
      res.status(204).send();
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
    }
  };

  updateUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const userData = req.body;
      const updatedUser = await this.adminService.updateUser(userId, userData);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
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