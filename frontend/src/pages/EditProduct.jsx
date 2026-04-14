import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import FormField from "../components/FormField";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, updateProduct } = useProducts();

  const [form, setForm] = useState({
    title: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    description: "",
    thumbnail: "",
    discountPercentage: "",
    rating: "",
  });

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null); // Error state add ki hai

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const p = await getProduct(id);
        if (isMounted && p) {
          setForm({
            title: p.title || "",
            price: p.price || "",
            stock: p.stock || "",
            category: p.category || "",
            brand: p.brand || "",
            description: p.description || "",
            thumbnail: p.thumbnail || "",
            discountPercentage: p.discountPercentage || "",
            rating: p.rating || "",
          });
        } else if (!p) {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details.");
      } finally {
        if (isMounted) setLoading(false); // Request fail ho ya pass, loading stop hogi
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id, getProduct]);

  const handle = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;

    setBusy(true);
    try {
      await updateProduct(id, {
        ...form,
        price: parseFloat(form.price) || 0,
        stock: parseInt(form.stock) || 0,
        discountPercentage: parseFloat(form.discountPercentage) || 0,
        rating: parseFloat(form.rating) || 0,
      });
      navigate("/"); // Success par wapis inventory par
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Error updating product. Please try again.");
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <span className="text-gray-500 font-medium">
          Loading product details...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-500 font-bold">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 underline"
        >
          Go back to Inventory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
        onClick={() => navigate("/")}
      >
        <span>←</span> Back to Inventory
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              ✎ Edit Product
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Update details for this item.
            </p>
          </div>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-mono font-bold">
            ID: {id.slice(-6)}...
          </span>
        </div>

        <div className="p-8">
          {form.thumbnail && (
            <div className="mb-8 flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <img
                src={form.thumbnail}
                alt="preview"
                className="w-20 h-20 object-contain rounded-lg bg-white border border-gray-200"
                onError={(e) => (e.target.style.display = "none")}
              />
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Current Image
                </p>
                <p className="text-xs text-gray-500 truncate max-w-xs">
                  {form.thumbnail}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={submit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              <div className="md:col-span-2">
                <FormField
                  label="Product Title"
                  name="title"
                  value={form.title}
                  onChange={handle}
                  required
                />
              </div>

              <FormField
                label="Price ($)"
                name="price"
                value={form.price}
                onChange={handle}
                required
                type="number"
                step="0.01"
              />

              <FormField
                label="Stock Quantity"
                name="stock"
                value={form.stock}
                onChange={handle}
                type="number"
              />

              <FormField
                label="Category"
                name="category"
                value={form.category}
                onChange={handle}
              />
              <FormField
                label="Brand"
                name="brand"
                value={form.brand}
                onChange={handle}
              />

              <div className="md:col-span-2">
                <FormField
                  label="Thumbnail URL"
                  name="thumbnail"
                  value={form.thumbnail}
                  onChange={handle}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-1.5 mb-6">
                <label className="text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100 min-h-[120px]"
                  name="description"
                  value={form.description}
                  onChange={handle}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={busy}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {busy ? "Saving Changes..." : "✓ Save Product"}
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-all"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
