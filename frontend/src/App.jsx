import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProductProvider } from "./context/ProductContext";
import Navbar from "./components/Navbar";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import ViewProduct from "./pages/ViewProduct";

export default function App() {
  return (
    <BrowserRouter>
      {/* ProductProvider is inside BrowserRouter so it can call useNavigate */}
      <ProductProvider>
        {/* Tailwind replaces inline styles: min-h-screen, flex, flex-col */}
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />

          {/* Main content area with a container for better spacing */}
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/add" element={<AddProduct />} />
              <Route path="/edit/:id" element={<EditProduct />} />
              <Route path="/view/:id" element={<ViewProduct />} />
            </Routes>
          </main>
        </div>
      </ProductProvider>
    </BrowserRouter>
  );
}
