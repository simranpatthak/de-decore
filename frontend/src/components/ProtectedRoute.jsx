import { Navigate, Outlet } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);    
    return decoded?.role || null;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

const ProtectedRoute = ({ allowedRoles }) => {
  const role = getUserRole();

  if (!role) {
    return <Navigate to="/login" replace />;
  }
console.log(role);

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
