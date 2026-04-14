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
  });

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const p = await getProduct(id);
        if (isMounted) {
          if (p) {
            setForm({
              title: p.title || "",
              price: p.price || "",
              stock: p.stock || "",
              category: p.category || "",
              brand: p.brand || "",
              description: p.description || "",
              thumbnail: p.thumbnail || p.image || "", // Supporting both keys
            });
            setError(null);
          } else {
            setError("Product not found in database.");
          }
        }
      } catch (err) {
        if (isMounted) setError("Failed to fetch product details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [id, getProduct]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await updateProduct(id, form);
      // Navigation is handled in Context, but we add a safety redirect here
      navigate("/");
    } catch (err) {
      setBusy(false);
    }
  };

  if (loading)
    return <div className="p-20 text-center">Loading details...</div>;
  if (error)
    return (
      <div className="p-20 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 underline"
        >
          Back to Home
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
      <form
        onSubmit={submit}
        className="space-y-4 bg-white p-6 rounded-xl shadow-sm border"
      >
        <FormField
          label="Title"
          name="title"
          value={form.title}
          onChange={handle}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Price"
            name="price"
            value={form.price}
            onChange={handle}
            type="number"
            required
          />
          <FormField
            label="Stock"
            name="stock"
            value={form.stock}
            onChange={handle}
            type="number"
          />
        </div>
        <FormField
          label="Image URL"
          name="thumbnail"
          value={form.thumbnail}
          onChange={handle}
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handle}
          className="w-full border p-2 rounded-lg h-32"
          placeholder="Description"
        />
        <button
          disabled={busy}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold disabled:bg-blue-300"
        >
          {busy ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
