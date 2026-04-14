import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";

export default function ViewProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct } = useProducts();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await getProduct(id);
        if (isMounted) {
          setProduct(data);
        }
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [id, getProduct]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-500">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-blue-600 hover:underline"
        >
          ← Back to Inventory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="mb-8 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
      >
        <span>←</span> Back to Inventory
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        {/* Left: Image Section */}
        <div className="md:w-1/2 bg-gray-50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
          <img
            src={
              product.thumbnail ||
              product.image ||
              "https://via.placeholder.com/500"
            }
            alt={product.title}
            className="max-h-[400px] w-full object-contain mix-blend-multiply transition-transform hover:scale-105 duration-300"
            onError={(e) => (e.target.src = "https://via.placeholder.com/500")}
          />
        </div>

        {/* Right: Info Section */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider rounded-full">
              {product.category || "General"}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              {product.title}
            </h1>
            <p className="text-sm text-gray-400 font-medium">
              Brand: {product.brand || "Unknown"}
            </p>

            <div className="flex items-center gap-4 py-2">
              <span className="text-3xl font-bold text-blue-600">
                ${product.price}
              </span>
              {product.stock > 0 ? (
                <span className="text-green-600 text-sm font-semibold bg-green-50 px-2 py-1 rounded">
                  In Stock ({product.stock})
                </span>
              ) : (
                <span className="text-red-500 text-sm font-semibold bg-red-50 px-2 py-1 rounded">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed italic">
                {product.description ||
                  "No description available for this product."}
              </p>
            </div>

            <div className="pt-8 flex gap-4">
              <button
                onClick={() => navigate(`/edit/${product._id}`)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-100"
              >
                Edit Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
