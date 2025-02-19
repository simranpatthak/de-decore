import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

const API_URL = `${API_BASE_URL}/api/user/profile`;

export const fetchProfile = createAsyncThunk("profile/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token"); // Token retrieve
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateProfile = createAsyncThunk("profile/updateProfile", async (profileData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(API_URL, profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const uploadAvatar = createAsyncThunk("profile/uploadAvatar", async (file, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axios.put(`${API_URL}`, formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    return response.data.avatar;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState: { profile: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload; 
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.avatar = action.payload; 
        }
      });
  },
});

export default profileSlice.reducer;
