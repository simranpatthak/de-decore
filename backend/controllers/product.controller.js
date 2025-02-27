import vine, { errors } from "@vinejs/vine";
import cloudinary from "../config/cloudinary.js";
import sharp from "sharp";
import prisma from "../config/db.js";
import { productSchema } from "../validations/productValidations.js";
import { logger } from "../utils/utils.js";

class ProductController {
  static async createProduct(req, res) {
    try {
      const validator = vine.compile(productSchema);
      const payload = await validator.validate(req.body);

      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ error: "At least one image is required." });
      }

      const imageUploadPromises = req.files.map(async (file, index) => {
        const compressedImage = await sharp(file.buffer)
          .resize({ width: 800 })
          .jpeg({ quality: 80 })
          .toBuffer();

        const result = await cloudinary.uploader.upload(
          `data:image/jpeg;base64,${compressedImage.toString("base64")}`,
          { folder: "decora/products", resource_type: "image" }
        );

        return { url: result.secure_url, isPrimary: index === 0 };
      });

      const images = await Promise.all(imageUploadPromises);

      const product = await prisma.product.create({
        data: {
          name: payload.name,
          description: payload.description,
          price: payload.price,
          discount: payload.discount,
          stock: payload.stock,
          images: { create: images },
        },
      });

      res.status(201).json(product);
    } catch (error) {
      console.log("The error is", error);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({
          status: 500,
          message: "Something went wrong. Please try again.",
        });
      }
    }
  }

  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const validator = vine.compile(productSchema);
      const payload = await validator.validate(req.body);

      const product = await prisma.product.update({
        where: { id: parseInt(id) },
        data: payload,
      });
      res.json(product);
    } catch (error) {
      console.log(error);

      logger.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const productId = parseInt(req.params.id);

      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { images: true },
      });

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const deleteImagePromises = product.images.map(async (image) => {
        const publicId = image.url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`decora/products/${publicId}`);
      });

      await Promise.all(deleteImagePromises);
      await prisma.product.delete({ where: { id: productId } });

      res.json({ message: "Product and its images deleted successfully" });
    } catch (error) {
      console.error("Error in deleteProduct:", error);
      res
        .status(500)
        .json({ message: "Something went wrong. Please try again." });
    }
  }

  static async getAllProducts(req, res) {
    try {
      const products = await prisma.product.findMany({
        include: { images: true },
      });
      res.json(products);
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({
          status: 500,
          message: "Something went wrong.Please try again.",
        });
      }
    }
  }

  static async getProductById(req, res) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(req.params.id) },
        include: { images: true, reviews: true },
      });
      if (!product) return res.status(404).json({ error: "Product not found" });
      res.json(product);
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({
          status: 500,
          message: "Something went wrong.Please try again.",
        });
      }
    }
  }

  static async updateDeliveryStatus(req, res) {
    try {
      const { status } = req.body;
      const productId = parseInt(req.params.id);
      const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid delivery status" });
      }

      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { deliveryStatus: status },
      });

      res.json({
        message: "Delivery status updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({
          status: 500,
          message: "Something went wrong.Please try again.",
        });
      }
    }
  }

}

export default ProductController;
