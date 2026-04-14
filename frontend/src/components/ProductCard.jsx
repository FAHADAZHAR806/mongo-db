import React from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";

export default function ProductCard({ product }) {
  const { deleteProduct } = useProducts();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image Section */}
      <div className="h-48 overflow-hidden bg-gray-100">
        <img
          src={
            product.thumbnail ||
            product.image ||
            "https://via.placeholder.com/300"
          }
          alt={product.title}
          className="w-full h-full object-contain"
          onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
        />
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 truncate">{product.title}</h3>
        <p className="text-blue-600 font-bold mt-1">${product.price}</p>

        <div className="flex gap-2 mt-4">
          {/* VIEW DETAILS BUTTON */}
          <Link
            to={`/view/${product._id}`}
            className="flex-1 bg-gray-100 text-center py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
          >
            View
          </Link>

          {/* EDIT BUTTON */}
          <Link
            to={`/edit/${product._id}`} // CRITICAL: Use _id
            className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Edit
          </Link>

          <button
            onClick={() => deleteProduct(product._id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
