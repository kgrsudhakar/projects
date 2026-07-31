import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct, useCart } from '../hooks/useProducts';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id!);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart({ productId: id!, quantity: 1 });
      alert('Product added to cart!');
    } catch (error) {
      alert('Failed to add product to cart');
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading product...</div>;
  if (!product) return <div className="p-8 text-center">Product not found.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block">← Back to Products</Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {product.images?.slice(1).map((img: string, i: number) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-md overflow-hidden">
                <img src={img} alt={product.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-semibold text-blue-600 mb-6">${product.price}</p>
          <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>
          <div className="mb-6">
            <span className="text-sm text-gray-500">Stock: </span>
            <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          <button
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
