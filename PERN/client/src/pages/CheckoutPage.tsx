import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, useOrders } from '../hooks/useProducts';

const CheckoutPage = () => {
  const { cartQuery } = useCart();
  const { checkout } = useOrders();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (cartQuery.isLoading) return <div className="p-8 text-center">Loading cart...</div>;

  const items = cartQuery.data || [];
  const totalAmount = items.reduce((acc: number, item: any) => acc + item.product.price * item.quantity, 0);

  const handlePayment = async () => {
    if (!address) return alert('Please enter a shipping address');
    setIsProcessing(true);
    try {
      await checkout(address);
      alert('Payment successful! Your order has been placed.');
      navigate('/orders');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
                <textarea
                  className="w-full p-2 border rounded mt-1 h-32"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full shipping address..."
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-6">
            {items.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.product.name} (x{item.quantity})</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={handlePayment}
            disabled={isProcessing || items.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
