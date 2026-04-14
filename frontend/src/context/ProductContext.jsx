import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductCtx = createContext();

// SMART URL LOGIC:
const isLocal = window.location.hostname === "localhost";

// Agar local hai toh localhost:5000, agar deployed hai toh relative path
// LEKIN: Relative path tabhi kaam karega jab vercel.json sahi ho (Step niche dekhein)
const BASE_URL = isLocal
  ? "http://localhost:5000/api/products"
  : "https://mongo-db-production-262b.up.railway.app/api/products";

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  /* ── Fetch all products ── */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(BASE_URL);
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      // This catches the "Network Error"
      setError("Connection failed. Is the backend running?");
      console.error("Fetch Error:", err);
    } finally {
      // THIS IS CRITICAL: It stops the "Loading" loop even if the server is dead
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ── Fetch single product ── */
  const getProduct = useCallback(async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (err) {
      console.error("Get Product Error:", err);
      return null;
    }
  }, []);

  /* ── Add product ── */
  const addProduct = useCallback(
    async (data) => {
      setLoading(true); // START LOADING
      try {
        const response = await axios.post(BASE_URL, data);
        setProducts((prev) => [response.data, ...prev]);
        showToast("Product added successfully!");
        navigate("/");
      } catch (err) {
        console.error("Add Error:", err.response?.data || err.message);
        showToast("Failed to add product.", "error");
      } finally {
        setLoading(false); // STOP LOADING
      }
    },
    [navigate],
  );

  /* ── Update product ── */
  const updateProduct = useCallback(
    async (id, data) => {
      setLoading(true); // START LOADING
      try {
        const response = await axios.put(`${BASE_URL}/${id}`, data);
        const updated = response.data;

        setProducts((prev) => prev.map((p) => (p._id === id ? updated : p)));
        showToast("Product updated successfully!");
        navigate("/");
      } catch (err) {
        console.error("Update Error:", err);
        showToast("Failed to update product.", "error");
      } finally {
        setLoading(false); // STOP LOADING
      }
    },
    [navigate],
  );

  /* ── Delete product ── */
  const deleteProduct = useCallback(async (id) => {
    setLoading(true); // START LOADING
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showToast("Product deleted successfully.");
    } catch (err) {
      console.error("Delete Error:", err);
      showToast("Failed to delete product.", "error");
    } finally {
      setLoading(false); // STOP LOADING
    }
  }, []);

  const filteredProducts = searchTerm.trim()
    ? products.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : products;

  return (
    <ProductCtx.Provider
      value={{
        products: filteredProducts,
        allProducts: products,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        fetchProducts,
        getProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        toast,
      }}
    >
      {children}

      {/* Global toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div
            className={`flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg text-white transition-all duration-300 ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            <span className="font-bold">
              {toast.type === "success" ? "✓" : "✕"}
            </span>
            {toast.msg}
          </div>
        </div>
      )}
    </ProductCtx.Provider>
  );
}

export function useProducts() {
  return useContext(ProductCtx);
}
