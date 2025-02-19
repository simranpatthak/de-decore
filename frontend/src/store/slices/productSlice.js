import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

const API_URL = `${API_BASE_URL}/api/product/products`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// ✅ Fetch all products
export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

// ✅ Fetch product by ID
export const fetchProductById = createAsyncThunk("products/fetchById", async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  
  return response.data;
});

// ✅ Add new product
export const addProduct = createAsyncThunk("products/add", async (product) => {
  const formData = new FormData();
  formData.append("name", product.name);
  formData.append("description", product.description);
  formData.append("price", product.price);
  formData.append("stock", product.stock);
  formData.append("discount", product.discount);
  product.images.forEach((image) => {
    formData.append("images", image);
  });

  const response = await axios.post(API_URL, formData, {
    headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" },
  });
  return response.data;
});

// ✅ Update product
export const updateProduct = createAsyncThunk("products/update", async ({ id, product }) => {
  const response = await axios.put(`${API_URL}/${id}`, product, {
    headers: getAuthHeader(),
  });
  return response.data;
});

// ✅ Delete product
export const deleteProduct = createAsyncThunk("products/delete", async (id) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return id;
});

// ✅ Slice
const productsSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    productDetails: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.productDetails = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        
        state.error = action.error.message;
      })
      // Add product
      .addCase(addProduct.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.payload);
      });
  },
});

export default productsSlice.reducer;
