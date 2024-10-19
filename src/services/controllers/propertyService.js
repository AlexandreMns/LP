import { Property } from "../../models/propertyModel.js";
import { createProperty } from "../../utils/dataUtil.js";
import { Wishlist } from "../../models/wishlistModel.js";

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

      // Filtra por número de pisos
      if (data.floors) {
        query.floors = parseInt(data.floors);
      }

      // Filtra por tamanho da garagem
      if (data.garageSize) {
        query.garageSize = parseInt(data.garageSize);
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

      // Conta o número total de propriedades que correspondem aos filtros
      const total = await Property.countDocuments(query);

      // Calcula o número total de páginas
      const totalPages = Math.ceil(total / data.limit);

      // Verifica se a página solicitada é maior que o número de páginas disponíveis
      if (data.page > totalPages) {
        // Redireciona para a última página disponível
        data.page = totalPages;
      }

      // Verifica se o número da página é menor que 1
      if (data.page < 1) {
        data.page = 1; // Redireciona para a primeira página
      }

      // Paginação
      let properties = await Property.find(query)
        .skip((data.page - 1) * data.limit) // Pula os documentos da página anterior
        .limit(parseInt(data.limit)); // Limita a quantidade de documentos retornados

      // Filtrar propriedades com status diferente de "Sold" após a busca
      properties = properties.filter((property) => property.status !== "Sold");

      if (properties.length === 0) {
        return "No properties found";
      }

      const payload = {
        properties,
        total,
        page: parseInt(data.page),
        pages: totalPages,
      };

      return payload;
    } catch (error) {
      throw new Error("Problem in fetching properties " + error);
    }
  }

  async getPropertyById(data) {
    try {
      const property = await Property.findById(data);
      if (!property) {
        return "Property not found";
      }
      return property;
    } catch (error) {
      throw new Error("Problem in fetching property by id " + error);
    }
  }

  // Método para deletar uma propriedade ver se nao tem que eliminar todos os relatorios associados a essa propriedade e outras coisas
  async deleteProperty(data) {
    try {
      // Primeiro, encontra e deleta a propriedade
      const property = await Property.findByIdAndDelete(data);
      if (!property) {
        return "Property not found";
      }

      // Remove todos os itens das wishlists que contêm essa propriedade
      await Wishlist.updateMany(
        { "items.property": data }, // Procura wishlists que contenham a propriedade
        { $pull: { items: { property: data } } } // Remove o item que contém a propriedade
      );

      return "Property deleted and related wishlist items removed successfully";
    } catch (error) {
      throw new Error("Problem in deleting property: " + error);
    }
  }

  async reserveProperty(propertyId) {
    try {
      const property = await Property.findOneAndUpdate(
        { _id: propertyId },
        { status: "reservado" },
        { new: true }
      );
      if (!property) {
        throw new Error("Property not found");
      }
      return property;
    } catch (error) {
      throw new Error("Problem in reserving property: " + error.message);
    }
  }

  async getSoldProperties(data) {
    try {
      // Cria o objeto de filtro vazio
      const query = {};

      // Filtro por tipo de propriedade (house, apartment, land)
      if (data.type) {
        query.type = data.type;
      }

      // Filtro por número de quartos
      if (data.bedrooms) {
        query.bedrooms = parseInt(data.bedrooms);
      }

      // Filtro por número de casas de banho
      if (data.bathrooms) {
        query.bathrooms = parseInt(data.bathrooms);
      }

      // Filtro por número de pisos
      if (data.floors) {
        query.floors = parseInt(data.floors);
      }

      // Filtro por tamanho da garagem
      if (data.garageSize) {
        query.garageSize = parseInt(data.garageSize);
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

      // Conta o número total de propriedades que correspondem aos filtros
      const total = await Property.countDocuments({ ...query, status: "Sold" });

      // Calcula o número total de páginas
      const totalPages = Math.ceil(total / data.limit);

      // Verifica se a página solicitada é maior que o número de páginas disponíveis
      if (data.page > totalPages) {
        // Redireciona para a última página disponível
        data.page = totalPages;
      }

      // Verifica se o número da página é menor que 1
      if (data.page < 1) {
        data.page = 1; // Redireciona para a primeira página
      }

      // Paginação
      const properties = await Property.find({ ...query, status: "Sold" }) // Aplica o status diretamente aqui
        .skip((data.page - 1) * data.limit) // Pula os documentos da página anterior
        .limit(data.limit); // Limita a quantidade de documentos retornados

      if (properties.length === 0) {
        return "No properties found";
      }

      const payload = {
        properties,
        total,
        page: parseInt(data.page), // página atual
        pages: totalPages, // número total de páginas
      };

      return payload;
    } catch (error) {
      throw new Error("Problem in fetching sold properties: " + error.message);
    }
  }
}
