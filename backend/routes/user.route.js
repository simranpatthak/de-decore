
import { Router } from "express";

import { upload } from "../utils/utils.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import UserController from "../controllers/user.controller.js";

const router = Router();

router.get("/profile", authMiddleware, UserController.getProfile);
router.put("/profile", authMiddleware, upload.single("avatar"), UserController.updateProfile);
router.post("/address", authMiddleware, UserController.createAddress);
router.get("/address", authMiddleware, UserController.getAddress);
router.put("/address/:id", authMiddleware, UserController.updateAddress);
router.delete("/address/:id", authMiddleware, UserController.deleteAddress);
router.post("/reviews/:id", authMiddleware, UserController.addReview);
router.put("/reviews/:id", authMiddleware, UserController.updateReview);
router.delete("/reviews/:id", authMiddleware, UserController.deleteReview);
router.post("/cart/add", authMiddleware, UserController.addToCart);
router.post("/cart/remove", authMiddleware, UserController.removeFromCart);
router.get("/cart", authMiddleware, UserController.getUserCart);
router.delete("/cart/clear", authMiddleware, UserController.clearCart);
export default router;
