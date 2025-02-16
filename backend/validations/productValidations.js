import vine  from "@vinejs/vine";
import { CustomErrorReporter } from "./CustomErrorReporter.js";

vine.errorReporter = () => new CustomErrorReporter();

export const productSchema = vine.object({
    name: vine.string().minLength(3),
    description: vine.string().minLength(10),
    price: vine.number().positive(),
    discount: vine.number().min(0).max(100).optional(),
    stock: vine.number().min(0),
  })

