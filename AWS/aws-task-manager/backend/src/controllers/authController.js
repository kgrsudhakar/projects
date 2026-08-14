import * as authService from "../services/authService.js";

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "name, email and password are required"
      });
    }

    const result = await authService.register({
      name,
      email,
      password
    });

    res.status(201).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required"
      });
    }

    const result = await authService.login({ email, password });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
}
