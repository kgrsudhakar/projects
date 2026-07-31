import React from 'react';
import { useAdminStats, useAdminUsers, useAdminOrders, useUpdateUserRole, useUpdateOrderStatus } from '../hooks/useAdmin';

const AdminDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: users, isLoading: usersLoading } = useAdminUsers();
  const { data: orders, isLoading: ordersLoading } = useAdminOrders();
  const { mutateAsync: updateRole } = useUpdateUserRole();
  const { mutateAsync: updateStatus } = useUpdateOrderStatus();

  if (statsLoading || usersLoading || ordersLoading) return <div className="p-8 text-center">Loading admin dashboard...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <p className="text-gray-500 text-sm mb-1">Total Users</p>
          <p className="text-2xl font-bold">{stats?.userCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <p className="text-gray-500 text-sm mb-1">Total Products</p>
          <p className="text-2xl font-bold">{stats?.productCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <p className="text-gray-500 text-sm mb-1">Total Orders</p>
          <p className="text-2xl font-bold">{stats?.orderCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <p className="text-gray-500 text-sm mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-blue-600">${stats?.totalRevenue?.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <div className="bg-white shadow rounded-lg overflow-hidden border">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase">
                <tr>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users?.map((user: any) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => updateRole({ id: user.id, role: user.role === 'ADMIN' ? 'USER' : 'ADMIN' })}
                        className="text-blue-600 hover:underline"
                      >
                        Toggle Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Order Management</h2>
          <div className="bg-white shadow rounded-lg overflow-hidden border">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders?.map((order: any) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 font-mono">{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-4">{order.user?.email}</td>
                    <td className="px-6 py-4">${order.totalAmount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus({ id: order.id, status: e.target.value })}
                        className="p-1 border rounded text-xs"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PAID">Paid</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
