import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { WishlistController } from "../../controllers/wishlistController.js";
import { WishlistService } from "../../services/controllers/wishlistService.js";

const router = Router();
const wishlistService = new WishlistService();
const wishlistController = new WishlistController(wishlistService);

// ========================== Wishlist Routes ==========================

// Adicionar item à wishlist
router.post("/:itemId", verifyToken, wishlistController.addToWishlist);

// Remover item da wishlist
router.delete("/:itemId", verifyToken, wishlistController.removeFromWishlist);

// Listar wishlist
router.get("/", verifyToken, wishlistController.viewWishlist);

export default router;
