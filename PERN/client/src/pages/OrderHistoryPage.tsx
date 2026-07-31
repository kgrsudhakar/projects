import React from 'react';
import { useOrders } from '../hooks/useProducts';

const OrderHistoryPage = () => {
  const { ordersQuery } = useOrders();

  if (ordersQuery.isLoading) return <div className="p-8 text-center">Loading orders...</div>;

  const orders = ordersQuery.data || [];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow border flex flex-col md:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-lg">Order #{order.id.slice(0, 8)}</span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                <div className="text-sm text-gray-600">
                  Ship to: {order.shippingAddress}
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">${order.totalAmount}</p>
                <p className="text-sm text-gray-500">{order.items?.length} items</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
