import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../../utils/api";

export const registerUser = createAsyncThunk("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const loginUser = createAsyncThunk("auth/loginUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, userData);
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchUserProfile = createAsyncThunk("auth/fetchUserProfile", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false, error: null, success: null },
  reducers: {
    logoutUser: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.errors;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = jwtDecode(action.payload.token);
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
