import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      if (!action.payload) {
        // ❌ no user → NOT authenticated
        state.user = null;
        state.isAuthenticated = false;
      } else {
        // ✅ valid user
        state.user = action.payload;
        state.isAuthenticated = true;
      }
      state.loading = false;
    },

    clearAuth(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
