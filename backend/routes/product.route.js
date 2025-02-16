import e, { Router } from "express";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware.js";
import { upload } from "../utils/utils.js";
import ProductController from "../controllers/product.controller.js";
const router = Router()

router.post('/products', authMiddleware,isAdmin ,upload.array('images', 6),ProductController.createProduct); 
router.delete('/products/:id', authMiddleware,isAdmin,ProductController.deleteProduct); 
router.get('/products',ProductController.getAllProducts); 
router.get('/products/:id',ProductController.getProductById);
router.put('/products/:id',ProductController.updateProduct);
router.put("/products/:id/delivery-status", authMiddleware, isAdmin, ProductController.updateDeliveryStatus);

export default router;