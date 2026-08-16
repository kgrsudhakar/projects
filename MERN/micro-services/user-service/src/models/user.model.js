export function createUser({ id, name, email, passwordHash, salt }) {
  return {
    id,
    name,
    email,
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
  };
}

/**
 * NEVER send passwordHash/salt back over the wire. This is the
 * "public shape" of a user - controllers should always respond with
 * this, never the raw stored record.
 */
export function toPublicUser(user) {
  const { passwordHash, salt, ...publicUser } = user;
  return publicUser;
}
