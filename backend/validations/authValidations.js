import vine from '@vinejs/vine';
import { CustomErrorReporter } from './CustomErrorReporter.js';


vine.errorReporter = () => new CustomErrorReporter();

export const registerSchema = vine.object({
    email: vine.string().trim().email(),
    password: vine.string().minLength(6).maxLength(20).confirmed(),
    role: vine.enum(['USER', 'ADMIN']).optional(),
  })


export const loginSchema = 
  vine.object({
    email: vine.string().trim().email().toLowerCase(),
    password: vine.string().minLength(6).maxLength(20),
  })