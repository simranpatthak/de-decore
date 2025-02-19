import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { registerUser } from "../../store/slices/authSlice";
import { Link } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({}); // Field-level validation errors

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    dispatch(registerUser(formData)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("User registered successfully!");
      } else if (res.meta.requestStatus === "rejected") {
        if (res.payload?.errors) {
          // Field-specific errors
          setErrors(res.payload.errors);
        } else {
          // General error messages
          toast.error(res.payload?.message || "Something went wrong!");
        }
      }
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
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
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.password ? "border-red-500" : ""}`}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4">
            <label className="block mb-1">Confirm Password</label>
            <input
              type="password"
              name="password_confirmation"
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.password_confirmation ? "border-red-500" : ""}`}
            />
            {errors.password_confirmation && <p className="text-red-500 text-sm">{errors.password_confirmation}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="mt-4 text-center">
            Already have an account?{" "}
            <Link className="text-blue-800" to={"/login"}>
              Click here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
