export class AgentController {
  constructor(agentService) {
    this.agentService = agentService;
  }

  getProfile = async (req, res) => {
    try {
      const agent = await this.agentService.getProfile(req.user.id);
      res.status(200).json(agent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  updateProfile = async (req, res) => {
    try {
      const agent = await this.agentService.updateProfile(
        req.user.id,
        req.body
      );
      res.status(200).json(agent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getProperties = async (req, res) => {
    try {
      const properties = await this.agentService.getProperties(req.user.id);
      res.status(200).json(properties);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
