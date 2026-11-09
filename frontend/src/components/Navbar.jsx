import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">

        <div className="flex items-center justify-between">

          {/* Brand */}
          <Link
            to="/"
            onClick={closeMenu}
            className="text-2xl font-extrabold tracking-tight"
          >
            Ekiti<span className="text-green-600">Move</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">

            {/* Home */}
            <Link
              to="/"
              className={`relative font-semibold py-2 group transition ${
                isActive("/")
                  ? "text-green-600"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              Home

              <span
                className={`absolute left-0 bottom-0 h-0.5 bg-green-600 rounded-full transition-all duration-300 ${
                  isActive("/") ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>

            {/* Routes */}
            <Link
              to="/routes"
              className={`relative font-medium py-2 group transition ${
                isActive("/routes")
                  ? "text-green-600"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              Routes

              <span
                className={`absolute left-0 bottom-0 h-0.5 bg-green-600 rounded-full transition-all duration-300 ${
                  isActive("/routes") ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>

            {/* About */}
            <Link
              to="/about"
              className={`relative font-medium py-2 group transition ${
                isActive("/about")
                  ? "text-green-600"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              About

              <span
                className={`absolute left-0 bottom-0 h-0.5 bg-green-600 rounded-full transition-all duration-300 ${
                  isActive("/about") ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>

            {/* Login */}
            <Link
              to="/login"
              className={`font-medium transition ${
                isActive("/login")
                  ? "text-green-600"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              Login
            </Link>

            {/* Sign Up */}
            <Link
              to="/register"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-sm hover:shadow-md transition"
            >
              Sign Up
            </Link>

          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700 text-2xl"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden mt-5 pt-5 border-t border-gray-100">

            <div className="flex flex-col gap-2">

              {/* Mobile Home */}
              <Link
                to="/"
                onClick={closeMenu}
                className={`py-3 px-3 rounded-lg font-semibold transition ${
                  isActive("/")
                    ? "bg-green-50 text-green-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-green-600"
                }`}
              >
                Home
              </Link>

              {/* Mobile Routes */}
              <Link
                to="/routes"
                onClick={closeMenu}
                className={`py-3 px-3 rounded-lg font-medium transition ${
                  isActive("/routes")
                    ? "bg-green-50 text-green-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-green-600"
                }`}
              >
                Routes
              </Link>

              {/* Mobile About */}
              <Link
                to="/about"
                onClick={closeMenu}
                className={`py-3 px-3 rounded-lg font-medium transition ${
                  isActive("/about")
                    ? "bg-green-50 text-green-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-green-600"
                }`}
              >
                About
              </Link>

              {/* Mobile Login */}
              <Link
                to="/login"
                onClick={closeMenu}
                className={`py-3 px-3 rounded-lg font-medium transition ${
                  isActive("/login")
                    ? "bg-green-50 text-green-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-green-600"
                }`}
              >
                Login
              </Link>

              {/* Mobile Sign Up */}
              <Link
                to="/register"
                onClick={closeMenu}
                className="mt-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold transition text-center"
              >
                Sign Up
              </Link>

            </div>

          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;
