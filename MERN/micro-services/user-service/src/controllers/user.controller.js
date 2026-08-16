import { userService } from "../services/user.service.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const userController = {
  register: asyncHandler(async (req, res) => {
    const user = await userService.register(req.body);
    res.status(201).json({ data: user });
  }),

  login: asyncHandler(async (req, res) => {
    const user = await userService.login(req.body);
    res.json({ data: user });
  }),

  getById: asyncHandler(async (req, res) => {
    const user = await userService.getUser(req.params.id);
    res.json({ data: user });
  }),

  list: asyncHandler(async (req, res) => {
    const users = await userService.listUsers();
    res.json({ data: users });
  }),
};
