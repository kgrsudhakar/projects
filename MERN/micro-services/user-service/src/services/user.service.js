import { userRepository } from "../repositories/user.repository.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { toPublicUser } from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";

class UserService {
  async register({ name, email, password }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw AppError.conflict(`Email ${email} is already registered`);

    const { salt, passwordHash } = hashPassword(password);
    const user = await userRepository.create({ name, email, passwordHash, salt });
    return toPublicUser(user);
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw AppError.badRequest("Invalid email or password");

    const valid = verifyPassword(password, user.salt, user.passwordHash);
    if (!valid) throw AppError.badRequest("Invalid email or password");

    return toPublicUser(user);
  }

  async getUser(id) {
    const user = await userRepository.findById(id);
    if (!user) throw AppError.notFound(`User ${id} not found`);
    return toPublicUser(user);
  }

  async listUsers() {
    const users = await userRepository.findAll();
    return users.map(toPublicUser);
  }
}

export const userService = new UserService();
