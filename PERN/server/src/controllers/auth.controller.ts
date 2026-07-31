import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';
import { registerSchema, loginSchema } from '../validators/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const user = await registerUser(validatedData);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await loginUser(validatedData);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
