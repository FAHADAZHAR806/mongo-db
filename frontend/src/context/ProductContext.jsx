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
      // Ensure we always have an array
      setProducts(Array.isArray(response.data) ? response.data : []);
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

  /* ── Fetch single product (For Edit Page) ── */
  const getProduct = useCallback(async (id) => {
    // Note: We don't set global loading here because EditProduct has its own
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
      setLoading(true);
      try {
        const response = await axios.post(BASE_URL, data);
        setProducts((prev) => [response.data, ...prev]);
        showToast("Product added successfully!");
        navigate("/");
      } catch (err) {
        console.error("Add Error:", err);
        showToast("Failed to add product.", "error");
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  /* ── Update product ── */
  const updateProduct = useCallback(
    async (id, data) => {
      setLoading(true);
      try {
        const response = await axios.put(`${BASE_URL}/${id}`, data);
        const updated = response.data;

        // Update local state so search/list updates immediately
        setProducts((prev) => prev.map((p) => (p._id === id ? updated : p)));

        showToast("Product updated successfully!");
        // Success ke baad hi navigate karein
        navigate("/");
      } catch (err) {
        console.error("Update Error:", err);
        showToast("Update failed.", "error");
        throw err; // Form ko batane ke liye ke error aaya hai
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  /* ── Delete product ── */
  const deleteProduct = useCallback(async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showToast("Deleted successfully.");
    } catch (err) {
      console.error("Delete Error:", err);
      showToast("Delete failed.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // SEARCH LOGIC: Title, Brand aur Category teeno par search chalega
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
        products: filteredProducts, // Ye list search ke mutabiq hogi
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

      {/* Toast UI */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[9999]">
          <div
            className={`flex items-center gap-3 px-6 py-3 rounded-xl shadow-2xl text-white transform transition-all animate-in slide-in-from-right ${
              toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"
            }`}
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
