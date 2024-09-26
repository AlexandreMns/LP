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
      const dashboardData = await this.adminService.getDashboardData();
      res.status(200).json(dashboardData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const userData = req.body;
      const newUser = await this.adminService.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const userId = req.params.userId;
      await this.adminService.deleteUser(userId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const userId = req.params.userId;
      const userData = req.body;
      const updatedUser = await this.adminService.updateUser(userId, userData);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default AdminController;