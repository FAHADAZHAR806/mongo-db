import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // LocalStorage se user info nikalna
  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setIsOpen(false);
    navigate("/login");
    window.location.reload(); // App state reset karne ke liye
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* 1. LOGO SECTION */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">📦</span>
            <span className="font-extrabold text-xl tracking-tight text-gray-900">
              PRO<span className="text-blue-600">MGR</span>
            </span>
          </Link>

          {/* 2. MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            {isOpen ? "✕" : "☰"}
          </button>

          {/* 3. DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-6">
            {userInfo ? (
              <>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-blue-600 font-medium"
                >
                  Inventory
                </Link>
                <button
                  onClick={() => navigate("/add")}
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                >
                  + Add Product
                </button>
                <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>
                <span className="text-gray-700 font-medium">
                  Hi, {userInfo.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-red-500 font-bold hover:text-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 font-bold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gray-900 text-white px-5 py-2 rounded-xl font-bold hover:bg-black transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* 4. MOBILE DRAWER */}
        {isOpen && (
          <div className="md:hidden pb-6 space-y-4 animate-in slide-in-from-top duration-200">
            <hr className="border-gray-100" />
            {userInfo ? (
              <>
                <p className="px-2 text-sm text-gray-500 font-bold">
                  Logged in as: {userInfo.name}
                </p>
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 px-2 text-gray-600 font-medium"
                >
                  Inventory List
                </Link>
                <button
                  onClick={() => {
                    navigate("/add");
                    setIsOpen(false);
                  }}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
                >
                  + Add New Product
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-bold"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-3 px-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-3 border border-gray-200 rounded-xl font-bold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-gray-900 text-white py-3 rounded-xl font-bold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
