import { HttpStatus } from "../utils/httpStatus.js";

export class AgentController {
  constructor(agentService) {
    this.agentService = agentService;
  }

  getProperties = async (req, res) => {
    try {
      const properties = await this.agentService.getProperties(req.user.id);
      res.status(200).json(properties);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  addProperty = async (req, res) => {
    try {
      const data = {
        type: req.body.type,
        agent: req.user,
        street: req.body.street,
        bathrooms: req.body.bathrooms,
        bedrooms: req.body.bedrooms,
        city: req.body.city,
        size: req.body.size,
        features: req.body.features,
        condition: req.body.condition,
        doorNumber: req.body.doorNumber,
        parish: req.body.parish,
        price: req.body.price,
        description: req.body.description,
        mapLocation: req.body.mapLocation,
        status: req.body.status,
      };
      const property = await this.agentService.addProperty(data);
      res.status(201).json(property);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
