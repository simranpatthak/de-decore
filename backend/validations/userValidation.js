import vine  from "@vinejs/vine";
import { CustomErrorReporter } from "./CustomErrorReporter.js";

vine.errorReporter = () => new CustomErrorReporter();
export const profileSchema = vine.object({
    name: vine.string().minLength(3).maxLength(50),
    email: vine.string().email(),
    phone: vine.string().optional(),
  });
  
  export const addressSchema = vine.object({
    street: vine.string().minLength(3),
    city: vine.string().minLength(2),
    state: vine.string().minLength(2),
    zip: vine.string().minLength(5).maxLength(10),
    country: vine.string().minLength(2),
  });
  
  export const reviewSchema = vine.object({
    productId: vine.number(),
    rating: vine.number()
    .min(0)
    .max(5),
    comment: vine.string().optional(),
  });