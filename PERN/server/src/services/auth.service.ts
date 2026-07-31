import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { RegisterInput, LoginInput } from '../validators/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await hashPassword(data.password);

  return await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
    select: { id: true, email: true, role: true, firstName: true, lastName: true },
  });
};

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await comparePassword(data.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user.id, user.role);

  return {
    user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
    token,
  };
};
