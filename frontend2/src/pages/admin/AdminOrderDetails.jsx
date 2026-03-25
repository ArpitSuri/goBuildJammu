import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getOrderById, // ⚠️ replace with admin API if created
    updateOrderStatus,
    updatePaymentStatus
} from "../../services/orderService";

export default function AdminOrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, []);

    const fetchOrder = async () => {
        try {
            const { data } = await getOrderById(id);
            setOrder(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusChange = async (value) => {
        try {
            setLoading(true);
            await updateOrderStatus(id, value);
            fetchOrder();
        } catch (err) {
            alert(err.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentChange = async (value) => {
        try {
            setLoading(true);
            await updatePaymentStatus(id, value);
            fetchOrder();
        } catch (err) {
            alert(err.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    if (!order) return <p className="p-6">Loading...</p>;

    return (
  <div className="p-6 bg-gray-100 min-h-screen">

    {/* Header */}
    <div className="max-w-5xl mx-auto mb-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Order Details
      </h1>
      <p className="text-sm text-gray-500">
        View and manage order
      </p>
    </div>

    <div className="max-w-5xl mx-auto space-y-4">

      {/* ORDER INFO */}
      <div className="bg-white border rounded-2xl p-4 shadow-sm">
        <h2 className="text-sm text-gray-500 mb-2">Order Info</h2>

        <p className="text-gray-700">
          <b>ID:</b> {order._id}
        </p>
        <p className="text-gray-700">
          <b>Total:</b> ₹ {order.totalAmount}
        </p>
        <p className="text-gray-700">
          <b>Address:</b> {order.address}
        </p>
      </div>

      {/* USER INFO */}
      {order.user && (
        <div className="bg-white border rounded-2xl p-4 shadow-sm">
          <h2 className="text-sm text-gray-500 mb-2">Customer</h2>

          <p className="text-gray-800 font-medium">
            {order.user.name}
          </p>
          <p className="text-gray-500 text-sm">
            {order.user.email}
          </p>
        </div>
      )}

      {/* STATUS CONTROLS */}
      <div className="bg-white border rounded-2xl p-4 shadow-sm">
        <h2 className="text-sm text-gray-500 mb-3">Status</h2>

        <div className="flex flex-wrap gap-4">

          {/* Order Status */}
          <div>
            <p className="text-xs text-gray-400 mb-1">
              Order Status
            </p>

            <select
              value={order.status}
              disabled={loading}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-600"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Status */}
          <div>
            <p className="text-xs text-gray-400 mb-1">
              Payment Status
            </p>

            <select
              value={order.paymentStatus}
              disabled={loading}
              onChange={(e) => handlePaymentChange(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-600"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
          </div>

        </div>
      </div>

      {/* ITEMS */}
      <div className="bg-white border rounded-2xl p-4 shadow-sm">
        <h2 className="text-sm text-gray-500 mb-3">Items</h2>

        <div className="divide-y">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between py-3"
            >
              <div>
                <p className="text-gray-800 font-medium">
                  {item.name}
                </p>

                <p className="text-xs text-gray-500">
                  {item.attributes
                    ? Object.values(item.attributes).join(" / ")
                    : ""}
                </p>
              </div>

              <div className="text-right text-sm">
                <p className="text-gray-600">
                  Qty: {item.quantity}
                </p>
                <p className="font-medium text-gray-800">
                  ₹ {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
);
}