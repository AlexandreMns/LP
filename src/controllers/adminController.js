import { HttpStatus } from "../utils/httpStatus.js";

export class AdminController {
  constructor(adminController) {
    this.adminController = adminController;
  }

  allUsers = async (req, res) => {
    console.log("All users");
    try {
      const response = await this.adminController.allUsers(req.user);
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
      const response = await this.adminController.changeRoles(data);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };
}
