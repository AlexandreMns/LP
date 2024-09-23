export class UserController {
  constructor(userServices) {
    this.userServices = userServices;
  }

  register = async (req, res) => {
    try {
      const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      };
      const response = await this.userServices.register(data);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const data = {
        email: req.body.email,
        password: req.body.password,
      };
      const response = await this.userServices.login(data);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  allUsers = async (req, res) => {
    try {
      const response = await this.userServices.allUsers();
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
