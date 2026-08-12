import api from "./axios";
import type { LoginRequest, LoginResponse } from "../types/auth";

export const loginApi = async (
  request: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    request
  );

  return response.data;
};