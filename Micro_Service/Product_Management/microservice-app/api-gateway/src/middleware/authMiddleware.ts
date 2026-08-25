import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


// ============================================
// JWT Payload
// ============================================

export interface AuthenticatedRequest
  extends Request {

  user?: {
    userId: number;
    email: string;
    role: string;
  };

}


// ============================================
// Authentication Middleware
// ============================================

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {

  try {

    // -----------------------------------------
    // Get Authorization header
    // -----------------------------------------

    const authHeader =
      req.headers.authorization;


    if (!authHeader) {

      return res.status(401).json({
        success: false,
        message:
          "Authorization header is required",
      });

    }


    // -----------------------------------------
    // Expected format:
    //
    // Authorization: Bearer TOKEN
    // -----------------------------------------

    const parts =
      authHeader.split(" ");


    if (
      parts.length !== 2 ||
      parts[0] !== "Bearer"
    ) {

      return res.status(401).json({
        success: false,
        message:
          "Invalid authorization format",
      });

    }


    const token = parts[1];


    // -----------------------------------------
    // JWT Secret
    // -----------------------------------------

    const secret =
      process.env.JWT_SECRET;


    if (!secret) {

      console.error(
        "JWT_SECRET is not configured"
      );

      return res.status(500).json({
        success: false,
        message:
          "Authentication configuration error",
      });

    }


    // -----------------------------------------
    // Verify JWT
    // -----------------------------------------

    const decoded =
      jwt.verify(
        token,
        secret
      ) as {
        userId: number;
        email: string;
        role: string;
      };


    // -----------------------------------------
    // Attach user to request
    // -----------------------------------------

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };


    // -----------------------------------------
    // Continue
    // -----------------------------------------

    next();

  } catch (error) {

    console.error(
      "JWT verification error:",
      error
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token",
    });

  }

};