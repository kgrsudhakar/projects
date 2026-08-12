import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem("accessToken"),
  user: null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{
        token: string;
        user: User;
      }>
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;

      localStorage.setItem(
        "accessToken",
        action.payload.token
      );
    },

    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("accessToken");
    },
  },
});

export const { loginSuccess, logout } =
  authSlice.actions;

export default authSlice.reducer;