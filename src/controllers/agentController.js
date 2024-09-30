import { HttpStatus } from "../utils/httpStatus.js";

export class AgentController {
  constructor(agentService) {
    this.agentService = agentService;
  }

  getProperties = async (req, res) => {
    try {
      const data = req.user;
      const properties = await this.agentService.getProperties(data);
      res.status(200).json(properties);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
