import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useProducts';

const CartPage = () => {
  const { cartQuery, updateQuantity, removeFromCart } = useCart();

  if (cartQuery.isLoading) return <div className="p-8 text-center">Loading cart...</div>;

  const items = cartQuery.data || [];
  const totalAmount = items.reduce((acc: number, item: any) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-6">Your cart is empty</p>
          <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Subtotal</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                        <span className="font-medium">{item.product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">${item.product.price}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                        >-</button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                        >+</button>
                      </div>
                    </td>
                    <td className="px-6 py-4">${(item.product.price * item.quantity).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-end gap-4">
            <div className="text-right space-y-2">
              <p className="text-gray-600">Subtotal: <span className="font-medium">${totalAmount.toFixed(2)}</span></p>
              <p className="text-2xl font-bold">Total: <span className="text-blue-600">${totalAmount.toFixed(2)}</span></p>
            </div>
            <Link
              to="/checkout"
              className="bg-blue-600 text-white px-12 py-4 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
