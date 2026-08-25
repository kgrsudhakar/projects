import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

interface OrderListProps {
  refresh?: number;
}

export default function OrderList({
  refresh = 0,
}: OrderListProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosClient.get(
          "/api/orders"
        );

        console.log("ORDERS API RESPONSE:", response.data);

        if (cancelled) return;

        /*
         * Support different API response formats
         */

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let data: any[] = [];

        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (
          Array.isArray(response.data?.data)
        ) {
          data = response.data.data;
        } else if (
          Array.isArray(response.data?.orders)
        ) {
          data = response.data.orders;
        }

        console.log("ORDERS EXTRACTED:", data);

        setOrders(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("ORDER ERROR:", err);

        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Failed to load orders"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [refresh]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <div className="flex items-center justify-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />

          <span className="text-sm text-slate-500">
            Loading orders...
          </span>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-700">
          Failed to load orders
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  // ==========================================
  // EMPTY
  // ==========================================

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
          🛍️
        </div>

        <h2 className="mt-4 text-lg font-bold text-slate-900">
          No Orders
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          No orders were returned by the API.
        </p>

        <p className="mt-4 text-xs text-slate-400">
          Check the browser console for the API response.
        </p>
      </div>
    );
  }

  // ==========================================
  // ORDERS TABLE
  // ==========================================

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-slate-200 p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-lg">
            🛍️
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Orders
            </h2>

            <p className="text-xs text-slate-500">
              Customer orders
            </p>
          </div>

        </div>

        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
          {orders.length} Orders
        </span>

      </div>


      {/* TABLE */}

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Order ID
              </th>

              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                User
              </th>

              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Product
              </th>

              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Quantity
              </th>

              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total
              </th>

              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>

              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Date
              </th>

            </tr>

          </thead>


          <tbody className="divide-y divide-slate-100">

            {orders.map(
              (order, index) => {

                /*
                 * Handle different possible
                 * backend field names.
                 */

                const orderId =
                  order.id ??
                  order.orderId ??
                  index + 1;

                const userId =
                  order.userId ??
                  order.user_id ??
                  order.customerId ??
                  "-";

                const productId =
                  order.productId ??
                  order.product_id ??
                  order.product?.id ??
                  "-";

                const productName =
                  order.productName ??
                  order.product_name ??
                  order.product?.name ??
                  `Product #${productId}`;

                const quantity =
                  order.quantity ??
                  order.qty ??
                  order.orderQuantity ??
                  1;

                const total =
                  order.totalAmount ??
                  order.total_amount ??
                  order.total ??
                  order.amount ??
                  0;

                const status =
                  order.status ??
                  "PENDING";

                const date =
                  order.createdAt ??
                  order.created_at;


                return (
                  <tr
                    key={orderId}
                    className="transition hover:bg-slate-50"
                  >

                    {/* ORDER ID */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">
                          #{orderId}
                        </div>

                        <span className="text-sm font-semibold text-slate-800">
                          #{orderId}
                        </span>

                      </div>

                    </td>


                    {/* USER */}

                    <td className="px-6 py-4">

                      <span className="text-sm text-slate-600">
                        User #{userId}
                      </span>

                    </td>


                    {/* PRODUCT */}

                    <td className="px-6 py-4">

                      <div>

                        <p className="text-sm font-medium text-slate-800">
                          {productName}
                        </p>

                        <p className="text-xs text-slate-400">
                          Product #{productId}
                        </p>

                      </div>

                    </td>


                    {/* QUANTITY */}

                    <td className="px-6 py-4">

                      <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                        {quantity}
                      </span>

                    </td>


                    {/* TOTAL */}

                    <td className="px-6 py-4">

                      <span className="text-sm font-bold text-slate-900">
                        ₹
                        {Number(total).toFixed(2)}
                      </span>

                    </td>


                    {/* STATUS */}

                    <td className="px-6 py-4">

                      <span
                        className={
                          `inline-flex rounded-full px-3 py-1 text-xs font-semibold ` +
                          (
                            status ===
                              "COMPLETED" ||
                            status ===
                              "DELIVERED"
                              ? "bg-emerald-100 text-emerald-700"
                              : status ===
                                "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          )
                        }
                      >
                        {status}
                      </span>

                    </td>


                    {/* DATE */}

                    <td className="px-6 py-4">

                      <span className="whitespace-nowrap text-sm text-slate-500">

                        {date
                          ? new Date(
                              date
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "-"}

                      </span>

                    </td>

                  </tr>
                );
              }
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}