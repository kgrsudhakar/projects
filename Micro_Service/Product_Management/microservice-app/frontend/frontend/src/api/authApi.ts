import apiClient from "./axiosClient";

export const loginUser = async (
  email: string,
  password: string
) => {
  const response =
    await apiClient.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

  return response.data;
};


export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const response =
    await apiClient.post(
      "/auth/register",
      {
        name,
        email,
        password,
      }
    );

  return response.data;
};