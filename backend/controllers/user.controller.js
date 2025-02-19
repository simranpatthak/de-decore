import vine, { errors } from "@vinejs/vine";
import cloudinary from "../config/cloudinary.js";
import sharp from "sharp";
import prisma from "../config/db.js";
import { logger } from "../utils/utils.js";
import {
  addressSchema,
  profileSchema,
  reviewSchema,
} from "../validations/userValidation.js";

class UserController {
  static async getProfile(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { addresses: true, reviews: true },
      });
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
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

  static async updateProfile(req, res) {
    try {
      const payload = req.body

      let profilePicUrl = null;
      if (req.file) {
        const compressedImage = await sharp(req.file.buffer)
          .resize({ width: 300 })
          .jpeg({ quality: 80 })
          .toBuffer();

        const result = await cloudinary.uploader.upload(
          `data:image/jpeg;base64,${compressedImage.toString("base64")}`,
          { folder: "decora/users", resource_type: "image" }
        );
        profilePicUrl = result.secure_url;
      }

      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: { ...payload, avatar: profilePicUrl || undefined },
      });

      res.json(updatedUser);
    } catch (error) {
      console.log(error);

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

  // Create Address
  static async createAddress(req, res) {
    try {
      const validator = vine.compile(addressSchema);
      const payload = await validator.validate(req.body);

      const address = await prisma.address.create({
        data: { ...payload, userId: req.user.id },
      });
      res.status(201).json(address);
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
  // get Address
  static async getAddress(req, res) {
    try {

      const address = await prisma.address.findMany({
        where:{
          userId:req.user.id 
        }
      })
      if (address.length===0) {
        
        return res.status(400).json({message:"No address added !"});
      }
      res.status(201).json({data:address});
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

  // Update Address
  static async updateAddress(req, res) {
    try {
      const validator = vine.compile(addressSchema);
      const payload = await validator.validate(req.body);

      const updatedAddress = await prisma.address.update({
        where: { id: parseInt(req.params.id), userId: req.user.id },
        data: payload,
      });
      res.json(updatedAddress);
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

  // Delete Address
  static async deleteAddress(req, res) {
    try {
      const isAddressExists = await prisma.address.findMany({
        where: {
          id: parseInt(req.params.id),
        },
      });
      console.log(isAddressExists);

      if (isAddressExists.length === 0) {
        return res.status(404).json({ error: "no address found !" });
      }
      await prisma.address.delete({
        where: { id: parseInt(req.params.id), userId: req.user.id },
      });
      res.json({ message: "Address deleted successfully" });
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

  // Add Review
  static async addReview(req, res) {
    try {
        const validator = vine.compile(reviewSchema);
        const payload = await validator.validate(req.body);
    
        // Ensure productId is a number
        const productId = Number(payload.productId);
        if (isNaN(productId)) {
          return res.status(400).json({ error: "Invalid productId" });
        }
    
        // Check if the product exists
        const productExists = await prisma.product.findUnique({ where: { id: productId } });
        if (!productExists) {
          return res.status(404).json({ error: "Product not found" });
        }
    
        const review = await prisma.review.create({
          data: {
            productId,
            rating: payload.rating || 0, // Default rating to 0
            comment: payload.comment,
            userId: req.user.id, // Ensure userId is set from the logged-in user
          },
        });
    
        res.status(201).json({message:"Added review successfully !",review});
    } catch (error) {
      console.log(error);

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

  // Update Review
  static async updateReview(req, res) {
    try {
      const validator = vine.compile(reviewSchema);
      const payload = await validator.validate(req.body);

      const updatedReview = await prisma.review.update({
        where: { id: parseInt(req.params.id), userId: req.user.id },
        data: payload,
      });
      res.json(updatedReview);
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

  // Delete Review
  static async deleteReview(req, res) {
    try {
      await prisma.review.delete({
        where: { id: parseInt(req.params.id), userId: req.user.id },
      });
      res.json({ message: "Review deleted successfully" });
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
  static async addToCart(req, res) {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user.id;
  
      if (!productId || quantity <= 0) {
        return res.status(400).json({ error: "Invalid product or quantity" });
      }
  
      const productExists = await prisma.product.findUnique({ where: { id: productId } });
      if (!productExists) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      const existingCartItem = await prisma.cart.findUnique({
        where: { userId_productId: { userId, productId } },
      });
  
      if (existingCartItem) {
        const updatedCart = await prisma.cart.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + quantity },
        });
        return res.json({ message: "Cart updated successfully", cart: updatedCart });
      } else {
        const newCartItem = await prisma.cart.create({
          data: { userId, productId, quantity },
        });
        return res.status(201).json({ message: "Product added to cart", cart: newCartItem });
      }
    } catch (error) {
      console.log(error);
      
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
  static async removeFromCart(req, res) {
    try {
      const { productId } = req.body;
      const userId = req.user.id;

      const cartItem = await prisma.cart.findFirst({
        where: { userId, productId },
      });

      if (!cartItem) {
        return res.status(404).json({ error: "Product not found in cart" });
      }

      if (cartItem.quantity > 1) {
        // Reduce quantity if more than 1
        const updatedCart = await prisma.cart.update({
          where: { id: cartItem.id },
          data: { quantity: cartItem.quantity - 1 },
        });
        return res.json({ message: "Cart updated", cart: updatedCart });
      } else {
        // Remove item from cart if quantity is 1
        await prisma.cart.delete({ where: { id: cartItem.id } });
        return res.json({ message: "Product removed from cart" });
      }
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
  static async getUserCart(req, res) {
    try {
      const userId = req.user.id;
  
      const cartItems = await prisma.cart.findMany({
        where: { userId },
        include: {
          product: true, // Fetch product details too
        },
      });
  
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Something went wrong. Please try again." });
    }
  }
  static async clearCart(req, res) {
    try {
      const userId = req.user.id;
  
      await prisma.cart.deleteMany({ where: { userId } });
  
      res.json({ message: "Cart cleared successfully" });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Something went wrong. Please try again." });
    }
  }
    
}

export default UserController;
