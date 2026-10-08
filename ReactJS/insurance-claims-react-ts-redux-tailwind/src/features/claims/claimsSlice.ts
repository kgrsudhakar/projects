import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Claim, ClaimStatus } from "../../types";
import { initialClaims } from "../../data/mockClaims";
interface State {
  items: Claim[];
  loading: boolean;
  error: string | null;
}
const initialState: State = {
  items: initialClaims,
  loading: false,
  error: null,
};

export const submitClaim = createAsyncThunk(
  "claims/submitClaim",
  async (claim: Omit<Claim, "id" | "status" | "submittedDate">) => {
    await new Promise((r) => setTimeout(r, 700));
    return {
      ...claim,
      id: `CLM-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Submitted" as ClaimStatus,
      submittedDate: new Date().toISOString().slice(0, 10),
    };
  },
);
const slice = createSlice({
  name: "claims",
  initialState,
  reducers: {
    updateClaimStatus(
      state,
      a: PayloadAction<{ id: string; status: ClaimStatus }>,
    ) {
      const c = state.items.find((x) => x.id === a.payload.id);
      if (c) c.status = a.payload.status;
    },
    deleteClaim(state, a: PayloadAction<string>) {
      state.items = state.items.filter((x) => x.id !== a.payload);
    },
  },
  extraReducers: (b) =>
    b
      .addCase(submitClaim.pending, (s) => {
        s.loading = true;
      })
      .addCase(submitClaim.fulfilled, (s, a) => {
        s.loading = false;
        s.items.unshift(a.payload);
      })
      .addCase(submitClaim.rejected, (s) => {
        s.loading = false;
        s.error = "Unable to submit claim.";
      }),
});
export const { updateClaimStatus, deleteClaim } = slice.actions;
export default slice.reducer;
