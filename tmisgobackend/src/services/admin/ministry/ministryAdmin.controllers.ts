import { NextFunction, Request, Response } from "express"
import { prisma } from "../../../lib/prisma"
import { generateJWT } from "../../../utils/managejwt";
import logger from "../../../loggers/loggers";

export class AdminController {
  // Signup function for admin users
  public static signup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { email, password, firstName, lastName, mobileNumber } = req.body;
      if (!email || !password || !firstName || !lastName || !mobileNumber) {
        return res.status(400).json({
          isError: true,
          message: "All fields are required",
          payload: undefined
        });
      }

      // Check if admin already exists
      const existingAdmin = await prisma.ministryAdmin.findFirst({
        where: { email }
      });
      if (existingAdmin) {
        return res.status(409).json({
          isError: true,
          message: "Admin with this email already exists",
          payload: undefined
        });
      }

      // Create new admin (password should be hashed in production)
      const newAdmin = await prisma.ministryAdmin.create({
        data: { 
          firstName,
          lastName,
          mobileNumber,
          email,
          password
        }
      });

      // Generate JWT token for the new admin
      const token = await generateJWT({ id: newAdmin.id, email: newAdmin.email, role: "admin" });
      return res.status(201).json({
        isError: false,
        message: "Admin registered successfully",
        payload: { id: newAdmin.id, email: newAdmin.email, token }
      });
    } catch (error) {

      logger.error("Error during admin signup:", error);

      return res.status(500).json({
        isError: true,
        message: "Signup failed",
        payload: undefined
      });
    }
  }

  // Login function for admin users
  public static login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          isError: true,
          message: "Email and password are required",
          payload: undefined
        });
      }

      // Find admin by email
      const admin = await prisma.ministryAdmin.findFirst({
        where: { email }
      });

      if (!admin) {
        return res.status(401).json({
          isError: true,
          message: "Invalid credentials",
          payload: undefined
        });
      }

      // Check password (assuming plain text for now, should hash in production)
      if (admin.password !== password) {
        return res.status(401).json({
          isError: true,
          message: "Invalid credentials",
          payload: undefined
        });
      }

      // Generate JWT token
      const token = await generateJWT({ id: admin.id, email: admin.email, role: "admin" });

      return res.status(200).json({
        isError: false,
        message: "Login successful",
        payload: { token }
      });
    } catch (error) {
      logger.error("Error during admin login:", error);
      
      return res.status(500).json({
        isError: true,
        message: "Login failed",
        payload: undefined
      });
    }
  }

}
