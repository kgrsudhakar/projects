import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";

import { policyApi } from "../features/policy/policyApi";

import { claimsApi } from "../features/claims/claimApi";

export const store = configureStore({

    reducer: {
        auth: authReducer,
        [policyApi.reducerPath]: policyApi.reducer,
        [claimsApi.reducerPath]: claimsApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(policyApi.middleware)
            .concat(claimsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;