import vine, { errors } from "@vinejs/vine";

import { generateToken } from "../utils/jwt.js";
import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import { loginSchema, registerSchema } from "../validations/authValidations.js";
class AuthController {
  static async register(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(registerSchema);
      const payload = await validator.validate(body);
      const { name,email, password, role } = payload;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser)
        return res.status(400).json({ message: "Email already exists" });

      payload.password = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
           ...payload
        },
      });
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log("The error is", error);
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
  static async login(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(loginSchema);
      const payload = await validator.validate(body);
      const { email, password } = payload;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user)
        return res.status(400).json({ message: "Invalid email or password" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid email or password" });

      const token = generateToken(user);
      res.json({ message: "Login successful", token ,status:200});
    } catch (error) {
      console.log("The error is", error);
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

export default AuthController;