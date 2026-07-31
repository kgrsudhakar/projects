import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts, useCategories } from '../hooks/useProducts';

const ProductListingPage = () => {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const { data: products, isLoading: productsLoading } = useProducts({ search, categoryId });
  const { data: categories, isLoading: catsLoading } = useCategories();

  if (productsLoading || catsLoading) return <div className="p-8 text-center">Loading products...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          className="p-2 border rounded flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories?.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product: any) => (
          <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition p-4 bg-white">
            <div className="h-48 bg-gray-200 rounded mb-4 overflow-hidden">
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
              )}
            </div>
            <h3 className="font-semibold text-lg truncate">{product.name}</h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-2">{product.description}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xl font-bold text-blue-600">${product.price}</span>
              <Link
                to={`/product/${product.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {products?.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No products found. Try adjusting your search or filter.
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;
