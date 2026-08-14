import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../db.js";
import { config } from "../config.js";

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name
    },
    config.jwtSecret,
    { expiresIn: "1h" }
  );
}

export async function register({ name, email, password }) {
  const existing = await query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (existing.rowCount) {
    const error = new Error("Email already registered");
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const result = await query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name, email, passwordHash]
  );

  const user = result.rows[0];

  return {
    user,
    token: createToken(user)
  };
}

export async function login({ email, password }) {
  const result = await query(
    "SELECT id, name, email, password_hash FROM users WHERE email = $1",
    [email]
  );

  if (!result.rowCount) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  delete user.password_hash;

  return {
    user,
    token: createToken(user)
  };
}
