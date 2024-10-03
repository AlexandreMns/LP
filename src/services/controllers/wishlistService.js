import { User } from "../../models/usersModel.js";
import { Wishlist } from "../../models/wishlistModel.js";

export class WishlistService {
  // Método para remover item da wishlist
  async removeFromWishlist(data) {
    try {
      const user = await User.findById(data.userId);
      if (!user) {
        throw new Error("User not found");
      }

      const wishlist = await Wishlist.findById(user.wishlist);
      if (!wishlist) {
        throw new Error("Wishlist not found");
      }

      // Remove item from wishlist
      wishlist.items = wishlist.items.filter(
        (item) => item.property.toString() !== data.itemId
      );
      await wishlist.save();
      return wishlist;
    } catch (error) {
      throw new Error("Problem in removing item from wishlist " + error);
    }
  }

  // Método para visualizar a wishlist
  async viewWishlist(data) {
    try {
      const userId = data;
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const wishList = await Wishlist.findById(user.wishlist);
      return wishList;
    } catch (error) {
      throw new Error("Problem in fetching user" + error);
    }
  }

  async addToWishlist(data) {
    try {
      const user = await User.findById(data.userId);
      if (!user) {
        throw new Error("User not found");
      }

      const wishlist = await Wishlist.findById(user.wishlist);
      if (!wishlist) {
        throw new Error("Wishlist not found");
      }

      // Verify if the item is already in the wishlist
      const isItemAlreadyInWishlist = wishlist.items.some(
        (item) => item.property.toString() === data.itemId
      );
      if (isItemAlreadyInWishlist) {
        return "Item already in wishlist";
      }

      const item = {
        property: data.itemId,
        note: data.note,
      };
      wishlist.items.push(item);

      await wishlist.save();

      return wishlist;
    } catch (error) {
      throw new Error("Problem in adding item to wishlist " + error);
    }
  }
}
