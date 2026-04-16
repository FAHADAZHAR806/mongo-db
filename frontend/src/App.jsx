import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProductProvider } from "./context/ProductContext";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import ViewProduct from "./pages/ViewProduct";
import Login from "./pages/Login";
import Register from "./pages/Register";

// ── PROTECTED ROUTE COMPONENT ──
// Ye component check karega ke localStorage mein user hai ya nahi
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("userInfo");

  if (!isAuthenticated) {
    // Agar login nahi hai, toh login page par bhej do
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                {/* ── PUBLIC ROUTES ── */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* ── PROTECTED ROUTES ── */}
                {/* Ye saare pages sirf login ke baad dikhen ge */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <ProductList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add"
                  element={
                    <ProtectedRoute>
                      <AddProduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit/:id"
                  element={
                    <ProtectedRoute>
                      <EditProduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/view/:id"
                  element={
                    <ProtectedRoute>
                      <ViewProduct />
                    </ProtectedRoute>
                  }
                />

                {/* Agar koi ghalat URL likhe toh redirect to home */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
