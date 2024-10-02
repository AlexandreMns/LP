export class WishlistController {
  constructor(wishlistService) {
    this.wishlistService = wishlistService;
  }

  addToWishlist = async (req, res) => {
    try {
      const userId = req.user; // vê se o id do usuário está disponível no token
      const itemId = req.params.itemId;
      const note = req.body.note || ""; // Nota opcional
      const wishlist = await this.wishlistService.addToWishlist(
        userId,
        itemId,
        note
      );
      console.log(wishlist);
      res.status(200).json(wishlist);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  removeFromWishlist = async (req, res) => {
    try {
      const userId = req.user; // vê se o id do usuário está disponível no token
      const itemId = req.params.itemId;
      const wishlist = await this.wishlistService.removeFromWishlist(
        userId,
        itemId
      );
      res.status(200).json(wishlist);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  viewWishlist = async (req, res) => {
    try {
      const data = req.user;
      console.log(data);
      const response = await this.wishlistService.viewWishlist(data);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
