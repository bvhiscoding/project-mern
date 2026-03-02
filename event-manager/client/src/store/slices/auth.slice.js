import { createSlice } from "@reduxjs/toolkit";

const getStoredUser = () => {
  const token = localStorage.getItem("token");
  if (!token || token === "undefined" || token === "null") {
    return null;
  }

  const storedUser = localStorage.getItem("user");
  if (!storedUser || storedUser === "undefined" || storedUser === "null") {
    return null;
  }
  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Invalid user in localStorage:", error);
    localStorage.removeItem("user");
    return null;
  }
};

const initialState = {
  user: getStoredUser(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const payload = action.payload || {};
      const normalizedUser = payload.user || payload;

      state.user = normalizedUser;
      localStorage.setItem("user", JSON.stringify(normalizedUser));

      if (payload.token) {
        localStorage.setItem("token", payload.token);
      }
    },
    clearCredentials: (state) => {
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    },
  },
});

export const { setCredentials, clearCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
