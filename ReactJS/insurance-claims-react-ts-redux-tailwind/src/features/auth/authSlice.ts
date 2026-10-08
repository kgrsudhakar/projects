import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
interface User {
  name: string;
  role: string;
}
interface State {
  user: User | null;
  isAuthenticated: boolean;
}
const initialState: State = {
  user: { name: "Sudhakar", role: "Claims Manager" },
  isAuthenticated: true,
};
const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(s) {
      s.user = null;
      s.isAuthenticated = false;
    },
    login(s, a: PayloadAction<User>) {
      s.user = a.payload;
      s.isAuthenticated = true;
    },
  },
});
export const { logout, login } = slice.actions;
export default slice.reducer;
