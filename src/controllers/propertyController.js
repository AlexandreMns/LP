import { HttpStatus } from "../utils/httpStatus.js";

export class PropertyController {
  constructor(propertyService) {
    this.propertyService = propertyService;
  }

  addProperty = async (req, res) => {
    try {
      const data = {
        type: req.body.type,
        floors: req.body.floors,
        garageSize: req.body.garageSize,
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
      const property = await this.propertyService.addProperty(data);
      res.status(201).json(property);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  allProperties = async (req, res) => {
    try {
      const data = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        sort: req.query.sort || "price",
        type: req.query.type,
        search: req.query.search,
        bedrooms: req.query.bedrooms,
        bathrooms: req.query.bathrooms,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        minSize: req.query.minSize,
        maxSize: req.query.maxSize,
        features: req.query.features,
      };
      // Chamada do serviço com os dados processados
      const response = await this.propertyService.allProperties(data);
      res.status(HttpStatus.OK).json({ response });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };

  getPropertyById = async (req, res) => {
    try {
      const data = req.params.id;
      const property = await this.propertyService.getPropertyById(data);
      res.status(200).json(property);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
