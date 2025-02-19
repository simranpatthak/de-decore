import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Register from "./pages/register";
import Login from "./pages/login";
import Home from "./pages/home";
import AddressBook from "./pages/address";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorised";
import ProfileUpdate from "./pages/profile";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/dashboard";
import Product from "./pages/admin/products";
import ProductCard from "./pages/products";
import ProductDetails from "./pages/products/details";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<ProductCard />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<ProtectedRoute allowedRoles={["USER", "ADMIN"]} />}>
            <Route path="/address" element={<AddressBook />} />
            <Route path="/profile" element={<ProfileUpdate />} />
          </Route>
        </Route>

        {/* 🔥 Admin Routes (Without Navbar) */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/products" element={<Product />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
