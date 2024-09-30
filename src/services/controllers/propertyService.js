import { Property } from "../../models/propertyModel.js";
import { createProperty } from "../../utils/dataUtil.js";

export class PropertyService {
  async addProperty(data) {
    try {
      const property = await createProperty(data);
      return property;
    } catch (error) {
      throw new Error("Problem in the addProperty " + error);
    }
  }

  async allProperties(data) {
    try {
      const query = {};

      // Filtra por tipo de propriedade (house, apartment, land)
      if (data.type) {
        query.type = data.type;
      }

      // Filtra por número de quartos
      if (data.bedrooms) {
        query.bedrooms = parseInt(data.bedrooms);
      }

      // Filtra por número de casas de banho
      if (data.bathrooms) {
        query.bathrooms = parseInt(data.bathrooms);
      }

      // Filtro de preço
      if (data.minPrice || data.maxPrice) {
        query.price = {};
        if (data.minPrice) query.price.$gte = parseInt(data.minPrice); // Preço maior ou igual ao mínimo
        if (data.maxPrice) query.price.$lte = parseInt(data.maxPrice); // Preço menor ou igual ao máximo
      }

      // Filtro de tamanho
      if (data.minSize || data.maxSize) {
        query.size = {};
        if (data.minSize) query.size.$gte = parseInt(data.minSize); // Tamanho maior ou igual ao mínimo
        if (data.maxSize) query.size.$lte = parseInt(data.maxSize); // Tamanho menor ou igual ao máximo
      }

      // Filtro por atributos em `features` (booleanos como airConditioning, pool, etc.)
      if (data.features) {
        const featuresArray = data.features.split(","); // Exemplo: ?features=airConditioning,pool
        featuresArray.forEach((feature) => {
          query[`features.${feature}`] = true; // Verifica se o atributo no features é true
        });
      }

      // Pesquisa com regex (por exemplo, em description, street ou city)
      if (data.search) {
        const regex = new RegExp(data.search, "i"); // "i" para case-insensitive
        query.$or = [
          { description: regex },
          { street: regex },
          { city: regex },
          { parish: regex },
        ];
      }
      // Definir ordenação apenas se o `sort` for válido
      const options = {};
      if (data.sort && data.sort.trim() !== "") {
        options.sort = data.sort; // Ordena apenas se sort for válido
      }

      // Paginação
      options.skip = (data.page - 1) * data.limit;
      options.limit = parseInt(data.limit);

      // Buscar propriedades com filtros e opções de ordenação
      const properties = await Property.find(query, null, options);

      // Contar o número total de propriedades que correspondem aos filtros
      const total = await Property.countDocuments(query);

      if (properties.length === 0) {
        return "No properties found";
      }

      const payload = {
        properties,
        total,
        page: parseInt(data.page),
        pages: Math.ceil(total / data.limit),
      };

      return payload;
    } catch (error) {
      throw new Error("Problem in fetching properties " + error);
    }
  }

  async getPropertyById(data) {
    try {
      const property = await Property.findById(data);
      return property;
    } catch (error) {
      throw new Error("Problem in fetching property by id " + error);
    }
  }
}
