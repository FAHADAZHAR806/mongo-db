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

const isLocal = window.location.hostname === "localhost";
const BASE_URL = isLocal
  ? "http://localhost:5000/api/products"
  : "https://mongo-db-production-262b.up.railway.app/api/products";

// ── AXIOS INSTANCE WITH AUTH ──
// Hum ek custom axios instance banate hain jo har request mein token check karega
const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

  /* ── Fetch all products (Public - No Token Needed) ── */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(BASE_URL);
      setProducts(
        Array.isArray(response.data.products)
          ? response.data.products
          : Array.isArray(response.data)
            ? response.data
            : [],
      );
    } catch (err) {
      setError("Failed to fetch products. Check backend connection.");
      console.error("Fetch Error:", err);
    } finally {
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

  /* ── Add product (Protected - Uses API instance) ── */
  const addProduct = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const response = await API.post("/", data); // API instance automatically adds token
        setProducts((prev) => [response.data, ...prev]);
        showToast("Product added successfully!");
        navigate("/");
      } catch (err) {
        const errMsg = err.response?.data?.message || "Failed to add product.";
        showToast(errMsg, "error");
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  /* ── Update product (Protected) ── */
  const updateProduct = useCallback(
    async (id, data) => {
      setLoading(true);
      try {
        const response = await API.put(`/${id}`, data);
        const updated = response.data;
        setProducts((prev) => prev.map((p) => (p._id === id ? updated : p)));
        showToast("Product updated successfully!");
        navigate("/");
      } catch (err) {
        showToast(err.response?.data?.message || "Update failed.", "error");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  /* ── Delete product (Protected) ── */
  const deleteProduct = useCallback(async (id) => {
    setLoading(true);
    try {
      await API.delete(`/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showToast("Deleted successfully.");
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      p.title?.toLowerCase().includes(term) ||
      p.category?.toLowerCase().includes(term) ||
      p.brand?.toLowerCase().includes(term)
    );
  });

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
      {toast && (
        <div className="fixed bottom-5 right-5 z-[9999]">
          <div
            className={`flex items-center gap-3 px-6 py-3 rounded-xl shadow-2xl text-white transform transition-all animate-in slide-in-from-right ${toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"}`}
          >
            <span className="text-xl font-bold">
              {toast.type === "success" ? "✓" : "✕"}
            </span>
            <span className="font-medium">{toast.msg}</span>
          </div>
        </div>
      )}
    </ProductCtx.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductCtx);
  if (!context)
    throw new Error("useProducts must be used within ProductProvider");
  return context;
}
