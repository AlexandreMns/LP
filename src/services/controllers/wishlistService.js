import { User } from "../../models/usersModel.js";

export class WishlistService {
  // Método para remover item da wishlist
  async removeFromWishlist(userId, itemId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      if (!user.wishList) {
        user.wishList = []; // Inicializa a wishList se estiver indefinida
      }
      user.wishList = user.wishList.filter(
        (item) => item.property && item.property.toString() !== itemId
      );
      await user.save();
      return user.wishList;
    } catch (error) {
      throw new Error("Problem in removing item from wishlist " + error);
    }
  }

  // Método para visualizar a wishlist
  async viewWishlist(data) {
    try {
      console.log(data);
      const user = await User.findById(data);
      if (!user) {
        throw new Error("User not found");
      }
      const wishlist = user.wishList;
      if (!wishlist) {
        return [];
      }
      return wishlist;
    } catch (error) {
      throw new Error("Problem in viewing wishlist " + error);
    }
  }

  async addToWishlist(userId, itemId, note) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      if (!user.wishList) {
        user.wishList = []; // Inicializa a wishList se estiver indefinida
      }
      // Verifica se o item já está na wishlist
      const existingItem = user.wishList.find(
        (item) => item.property && item.property.toString() === itemId
      );
      if (existingItem) {
        existingItem.note = note; // Atualiza a nota se o item já existir
      } else {
        user.wishList.push({ property: itemId, note });
      }
      await user.save();
      return user.wishList;
    } catch (error) {
      throw new Error("Problem in adding item to wishlist " + error);
    }
  }
}
