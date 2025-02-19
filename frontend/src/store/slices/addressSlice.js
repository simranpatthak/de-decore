import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

const apiUrl = `${API_BASE_URL}/api/user/address`;

export const fetchAddresses = createAsyncThunk("address/fetch", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(apiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const addAddress = createAsyncThunk("address/add", async (addressData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(apiUrl, addressData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateAddress = createAsyncThunk("address/update", async ({ id, addressData }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${apiUrl}/${id}`, addressData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteAddress = createAsyncThunk("address/delete", async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const addressSlice = createSlice({
  name: "address",
  initialState: { addresses: [], loading: false, error: null },  // addresses ko array banaya
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload.data; // ✅ Sirf data store kiya
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.map((address) =>
          address.id === action.payload.id ? action.payload : address
        );
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter((address) => address.id !== action.payload);
      });
  },
});


export default addressSlice.reducer;
