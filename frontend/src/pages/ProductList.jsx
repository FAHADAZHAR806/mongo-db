import React from "react";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";

export default function ProductList() {
  const { products, loading, searchTerm, setSearchTerm } = useProducts();

  // FIX: Frontend par products ko filter karna lazmi hai
  const filteredProducts = products.filter((p) => {
    const titleMatch = p.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const categoryMatch = p.category
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const brandMatch = p.brand
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return titleMatch || categoryMatch || brandMatch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        <p className="text-gray-500">Fetching inventory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="w-full max-w-xl mx-auto mb-8 relative">
        <input
          type="text"
          className="w-full p-4 pl-12 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="Search by title, brand, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Search Icon */}
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results Count */}
      {searchTerm && (
        <p className="text-sm text-gray-500 text-center">
          Found {filteredProducts.length} results for "{searchTerm}"
        </p>
      )}

      {/* Grid Display */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p._id || p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 text-lg">
            No products match your search.
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-2 text-blue-600 font-medium hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
