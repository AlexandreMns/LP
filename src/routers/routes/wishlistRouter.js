import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { WishlistController } from "../../controllers/wishlistController.js";
import { WishlistService } from "../../services/controllers/wishlistService.js";
import authorize from "../../middlewares/authorize.js";
import { roles } from "../../models/usersModel.js";

const router = Router();
const wishlistService = new WishlistService();
const wishlistController = new WishlistController(wishlistService);

// ========================== Wishlist Routes ==========================

// Adicionar item à wishlist
router.post(
  "/:itemId",
  verifyToken,
  authorize(roles.CLIENT),
  wishlistController.addToWishlist
);

// Remover item da wishlist
router.delete(
  "/:itemId",
  verifyToken,
  authorize(roles.CLIENT),
  wishlistController.removeFromWishlist
);

// Listar wishlist
router.get(
  "/",
  verifyToken,
  authorize(roles.CLIENT),
  wishlistController.viewWishlist
);

export default router;
