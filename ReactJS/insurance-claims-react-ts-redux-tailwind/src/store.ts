import { configureStore } from "@reduxjs/toolkit";
import claims from "./features/claims/claimsSlice";
import auth from "./features/auth/authSlice";

export const store = configureStore({ reducer: { claims, auth } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
