import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../store/slices/authSlice";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({}); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({}); 

    dispatch(loginUser(formData)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Login successful!");
        const token = localStorage.getItem("token");
        let role = null;
        if (token) {
          try {
            const decoded = jwtDecode(token);
            role = decoded?.role;
          } catch (error) {
            console.error("Token decode error:", error);
          }
        }

        if (role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else if (res.meta.requestStatus === "rejected") {
        if (res.payload?.errors) {
          setErrors(res.payload.errors);
        } else {
          toast.error(res.payload?.message || "Something went wrong!");
        }
      }
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email "
              className={`w-full p-2 border rounded ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Enter your password"
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.password ? "border-red-500" : ""}`}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="mt-4 text-center">
            Don't have an account? <Link className="text-blue-800" to="/signup">Click here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
