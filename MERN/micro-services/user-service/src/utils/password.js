import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Using Node's built-in crypto (scrypt) instead of a bcrypt dependency
 * to keep this service dependency-light. In a real system you'd likely
 * reach for bcrypt/argon2, but the pattern (hash + salt, never store
 * plaintext) is the same.
 */
export function hashPassword(plainPassword) {
  const salt = randomBytes(16).toString("hex");
  const passwordHash = scryptSync(plainPassword, salt, 64).toString("hex");
  return { salt, passwordHash };
}

export function verifyPassword(plainPassword, salt, storedHash) {
  const candidateHash = scryptSync(plainPassword, salt, 64);
  const storedBuffer = Buffer.from(storedHash, "hex");
  if (candidateHash.length !== storedBuffer.length) return false;
  return timingSafeEqual(candidateHash, storedBuffer);
}
