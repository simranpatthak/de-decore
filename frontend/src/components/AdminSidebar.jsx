import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaBoxOpen, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/authSlice";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
const dispatch = useDispatch()
const navigate = useNavigate()
  const toggleSidebar = () => setIsOpen(!isOpen);
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };
  
  return (
    <motion.div 
      initial={{ width: "60px" }} 
      animate={{ width: isOpen ? "240px" : "60px" }} 
      transition={{ duration: 0.3 }}
      className="h-screen bg-gray-900 text-white flex flex-col shadow-lg"
    >
      {/* Toggle Button */}
      <div className="flex justify-end p-2">
        <button onClick={toggleSidebar} className="text-gray-400 hover:text-white">
          {isOpen ? "←" : "→"}
        </button>
      </div>

      {/* Menu Items */}
      <motion.ul 
        className="mt-4 space-y-4"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <SidebarItem to="/admin/dashboard" icon={<FaTachometerAlt />} label="Dashboard" isOpen={isOpen} />
        <SidebarItem to="/admin/users" icon={<FaUsers />} label="Users" isOpen={isOpen} />
        <SidebarItem to="/admin/products" icon={<FaBoxOpen />} label="Products" isOpen={isOpen} />
        <button onClick={handleLogout}>

        <SidebarItem icon={<FaSignOutAlt />} label="Logout" isOpen={isOpen} />
        </button>
      </motion.ul>
    </motion.div>
  );
};

const SidebarItem = ({ to, icon, label, isOpen }) => (
  <Link to={to} className="flex items-center space-x-2 p-3 hover:bg-gray-800 rounded-md">
    <span className="text-xl">{icon}</span>
    {isOpen && <span className="text-sm">{label}</span>}
  </Link>
);

export default AdminSidebar;
