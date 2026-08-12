import { UserRepository } from "../repositories/user.repository.js";
import { RegisterRequest } from "../dto/RegisterRequest.js";

import {
  hashPassword,
  comparePassword,
} from "../utils/password.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

import { redisClient } from "../config/redis.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";

export class AuthService {
  private repository = new UserRepository();

  /**
   * Register User
   */
  async register(request: RegisterRequest) {
    const existingUser = await this.repository.findByEmail(
      request.email
    );

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await hashPassword(
      request.password
    );

    const user = await this.repository.create({
      ...request,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken(
      user.id,
      user.role ?? "CUSTOMER"
    );

    const refreshToken = generateRefreshToken(user.id);

    await redisClient.set(
      `refresh:${user.id}`,
      refreshToken,
      {
        EX: 60 * 60 * 24 * 7,
      }
    );

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login User
   */
  async login(email: string, password: string) {
    const user = await this.repository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError(

"Invalid email or password"

);
    }

    const isPasswordValid = await comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError(

"Invalid email or password"

);
    }

    // Optional
    // Comment this line if last_login column isn't available
    await this.repository.updateLastLogin(user.id);

    const accessToken = generateAccessToken(
      user.id,
      user.role ?? "CUSTOMER"
    );

    const refreshToken = generateRefreshToken(
      user.id
    );

    await redisClient.set(
      `refresh:${user.id}`,
      refreshToken,
      {
        EX: 60 * 60 * 24 * 7,
      }
    );

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Logout User
   */
  async logout(userId: string) {
    await redisClient.del(`refresh:${userId}`);

    return {
      message: "Logout successful",
    };
  }

  /**
   * Refresh Token Validation
   */
  async getRefreshToken(userId: string) {
    return await redisClient.get(
      `refresh:${userId}`
    );
  }


  async refreshToken(
  refreshToken: string
) {

    if (!refreshToken) {
        throw new Error("Refresh token missing");
    }

    const payload =
      verifyRefreshToken(refreshToken) as any;

    const stored =
      await redisClient.get(
        `refresh:${payload.userId}`
      );

    if (stored !== refreshToken) {
        throw new Error("Invalid refresh token");
    }

    const user =
      await this.repository.findById(
        payload.userId
      );

    if (!user) {
        throw new Error("User not found");
    }

    const accessToken =
      generateAccessToken(
        user.id,
        user.role ?? "CUSTOMER"
      );

    return {
        accessToken
    };
}
}

export default new AuthService();