import { useEffect, useState } from "react";
import {
    getMyDeliveryOrders,
    updateDeliveryStatus
} from "../../../services/deliveryService";

import DeliveryOrderModal from "./DeliveryOrderModel";

export default function DeliveryDashboard() {
    const [orders, setOrders] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loadingId, setLoadingId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const { data } = await getMyDeliveryOrders();
        setOrders(data);
    };

    const handleStatus = async (orderId, status) => {
        try {
            setLoadingId(orderId);
            await updateDeliveryStatus(orderId, status);
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message || "Error");
        } finally {
            setLoadingId(null);
        }
    };

    return (
  <div className="p-6 bg-gray-100 min-h-screen">

    {/* Header */}
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        My Deliveries
      </h1>
      <p className="text-sm text-gray-500">
        Manage your assigned orders
      </p>
    </div>

    {/* Orders */}
    {orders.length === 0 ? (
      <div className="bg-white p-10 rounded-2xl text-center text-gray-500 border">
        No deliveries assigned
      </div>
    ) : (
      <div className="grid gap-4">

        {orders.map(order => (
          <div
            key={order._id}
            className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition flex justify-between items-center"
          >

            {/* Left */}
            <div>
              <p className="font-medium text-gray-800">
                Order #{order._id.slice(-6)}
              </p>

              <p className="text-sm text-gray-500">
                {order.user?.name} • {order.user?.phone}
              </p>

              {/* Status Badge */}
              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                order.status === "assigned"
                  ? "bg-yellow-100 text-yellow-700"
                  : order.status === "picked"
                  ? "bg-blue-100 text-blue-700"
                  : order.status === "shipped"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-green-100 text-green-700"
              }`}>
                {order.status}
              </span>
            </div>

            {/* Right Actions */}
            <div className="flex gap-2">

              {/* View */}
              <button
                onClick={() => setSelected(order._id)}
                className="px-3 py-1.5 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                View
              </button>

              {/* Actions */}
              {order.status === "assigned" && (
                <button
                  onClick={() => handleStatus(order._id, "picked")}
                  disabled={loadingId === order._id}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
                >
                  Pick
                </button>
              )}

              {order.status === "picked" && (
                <button
                  onClick={() => handleStatus(order._id, "shipped")}
                  disabled={loadingId === order._id}
                  className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition disabled:opacity-50"
                >
                  Ship
                </button>
              )}

              {order.status === "shipped" && (
                <button
                  onClick={() => handleStatus(order._id, "delivered")}
                  disabled={loadingId === order._id}
                  className="px-3 py-1.5 bg-green-700 text-white rounded-lg text-sm hover:bg-green-800 transition disabled:opacity-50"
                >
                  Deliver
                </button>
              )}

            </div>
          </div>
        ))}

      </div>
    )}

    {/* Modal */}
    {selected && (
      <DeliveryOrderModal
        orderId={selected}
        onClose={() => setSelected(null)}
      />
    )}

  </div>
);
}