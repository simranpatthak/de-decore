import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/slices/authSlice";
import { toggleTheme } from "../../store/slices/themeSlice";
import {  FaMoon, FaSun, FaBars } from "react-icons/fa";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          
          {/* ☰ Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-900 dark:text-white" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaBars size={24} />
          </button>

          {/* 🏠 Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">
            De-Decore
          </Link>

          {/* 🖥️ Navigation Links */}
          <div className={`md:flex space-x-6 ${menuOpen ? "block" : "hidden"} md:block`}>
            <Link to="/products" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">Products</Link>
            <Link to="/services" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">Services</Link>
            <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">Contact</Link>
          </div>

          {/* 🌙 Theme Toggle & Profile */}
          <div className="flex items-center space-x-4">
            
            {/* 🌙 Theme Toggler */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {darkMode ? <FaSun className="text-yellow-400" size={20} /> : <FaMoon className="text-gray-900" size={20} />}
            </button>

            {/* 👤 User Profile */}
            <div className="relative" ref={dropdownRef}>
              {user ? (
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center">
                  <img
                    src={user.avatar ||`https://eu.ui-avatars.com/api/?name=${user?.name}&size=250`}
                    alt="Avatar"
                    className="w-9 h-9 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                  />
                </button>
              ) : (
                <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Login
                </Link>
              )}

              {/* 🔽 Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 z-50">
                  <h2 className="text-2xl font-semibold text-center my-3">
                    {user?.name }
                  </h2>
                  <Link to="/profile" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Profile
                  </Link>
                  <Link to="/address" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Address Book
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
