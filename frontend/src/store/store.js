import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice";
import addressReducer from "./slices/addressSlice";
import profileReducer from "./slices/profileSlice";
import productReducer from "./slices/productSlice";

export const store = configureStore({
  reducer: { theme: themeReducer ,
    auth: authReducer,
    address: addressReducer,
    profile: profileReducer,
    products: productReducer,
  },
});
