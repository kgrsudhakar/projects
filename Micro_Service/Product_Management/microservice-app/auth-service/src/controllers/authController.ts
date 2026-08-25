import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { pool } from "../config/db";


// ============================================
// REGISTER
// ============================================

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;


    // -----------------------------
    // Validate input
    // -----------------------------

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required",
      });
    }


    // -----------------------------
    // Check existing user
    // -----------------------------

    const existingUser =
      await pool.query(
        `
        SELECT id
        FROM users
        WHERE email = $1
        `,
        [email]
      );


    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }


    // -----------------------------
    // Hash password
    // -----------------------------

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    // -----------------------------
    // Create user
    // -----------------------------

    const result =
      await pool.query(
        `
        INSERT INTO users
        (
          name,
          email,
          password,
          role
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4
        )
        RETURNING
          id,
          name,
          email,
          role,
          created_at
        `,
        [
          name,
          email,
          hashedPassword,
          "USER",
        ]
      );


    // -----------------------------
    // Response
    // -----------------------------

    return res.status(201).json({
      success: true,
      message:
        "User registered successfully",
      data: result.rows[0],
    });

  } catch (error) {

    console.error(
      "Register error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
};



// ============================================
// LOGIN
// ============================================

export const login = async (
  req: Request,
  res: Response
) => {
  try {

    const {
      email,
      password,
    } = req.body;


    // -----------------------------
    // Validate input
    // -----------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }


    // -----------------------------
    // Find user
    // -----------------------------

    const result =
      await pool.query(
        `
        SELECT
          id,
          name,
          email,
          password,
          role
        FROM users
        WHERE email = $1
        `,
        [email]
      );


    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }


    const user = result.rows[0];


    // -----------------------------
    // Compare password
    // -----------------------------

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }


    // -----------------------------
    // JWT secret
    // -----------------------------

    const secret =
      process.env.JWT_SECRET;


    if (!secret) {
      throw new Error(
        "JWT_SECRET is not configured"
      );
    }


    // -----------------------------
    // Generate JWT
    // -----------------------------

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      secret,
      {
        expiresIn: "1h",
      }
    );


    // -----------------------------
    // Response
    // -----------------------------

    return res.status(200).json({

      success: true,

      message:
        "Login successful",

      data: {

        token,

        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },

      },

    });

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
};