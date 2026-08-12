import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

// const ACCESS_SECRET = process.env.JWT_SECRET!;
// const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;


const accessOptions: SignOptions = {
  expiresIn: "15m",
};

const refreshOptions: SignOptions = {
  expiresIn: "7d",
};

export function generateAccessToken(userId: string, role: string): string {
    return jwt.sign({ userId, role },
         env.jwtSecret,
         accessOptions
    );

}

export function generateRefreshToken(userId: string): string {
    return jwt.sign({ userId },
        env.jwtRefreshSecret,
        refreshOptions
    );
}


export function verifyAccessToken(token: string) {
    return jwt.verify(token, env.jwtSecret);

}

export function verifyRefreshToken(token: string) {
    return jwt.verify(token, env.jwtRefreshSecret);

}