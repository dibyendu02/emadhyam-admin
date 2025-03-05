import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  user: null,
  isFetching: false,
  error: false,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signupStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    signupSuccess: (state, action) => {
      state.isFetching = false;
      state.isAuth = true;
      state.error = false;
      state.token = action.payload.token; // Store the token
      state.user = action.payload.admin; // Store the admin info (id and email)
    },
    signupFailure: (state, action) => {
      state.isFetching = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuth = false;
      state.user = null;
      state.token = null;
    },
    updateUser: (state, action) => {
      state.isAuth = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
  },
});

export const { signupStart, signupSuccess, signupFailure, logout, updateUser } =
  authSlice.actions;

export default authSlice.reducer;
