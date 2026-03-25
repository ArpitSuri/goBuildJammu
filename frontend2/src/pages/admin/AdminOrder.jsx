import { useEffect, useState } from "react";
import {
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    assignDelivery
} from "../../../services/orderService";

import { getDelivery } from "../../../services/deliveryService";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loadingId, setLoadingId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [deliveries, setDeliveries] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await getAllOrders();
            setOrders(data.orders);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchDeliveries = async () => {
        try {
            const { data } = await getDelivery();
            setDeliveries(Array.isArray(data.delivery) ? data.delivery : []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchDeliveries();
    }, []);

    const handleAssignDelivery = async (orderId, deliveryId) => {
        try {
            setLoadingId(orderId);
            await assignDelivery(orderId, deliveryId);
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message);
        } finally {
            setLoadingId(null);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setLoadingId(orderId);
            await updateOrderStatus(orderId, newStatus);
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message);
        } finally {
            setLoadingId(null);
        }
    };

    const handlePaymentChange = async (orderId, newPayment) => {
        try {
            setLoadingId(orderId);
            await updatePaymentStatus(orderId, newPayment);
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message);
        } finally {
            setLoadingId(null);
        }
    };

    return (
  <div className="p-6 bg-gray-100 min-h-screen">

    {/* Header */}
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Orders
      </h1>
      <p className="text-sm text-gray-500">
        Manage customer orders
      </p>
    </div>

    {/* Orders */}
    {orders.length === 0 ? (
      <div className="bg-white rounded-2xl p-10 text-center border">
        <p className="text-gray-500">No orders found</p>
      </div>
    ) : (
      <div className="space-y-4">
        {orders.map(order => (
          <div
            key={order._id}
            className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition"
          >

            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">

              <div>
                <p className="font-medium text-gray-800">
                  Order #{order._id.slice(-6)}
                </p>
                <p className="text-sm text-gray-500">
                  ₹ {order.totalAmount}
                </p>
              </div>

              {/* CONTROLS */}
              <div className="flex flex-wrap gap-2 items-center">

                {/* Order Status */}
                <select
                  value={order.status}
                  disabled={loadingId === order._id}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className="px-2 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-green-600"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* Payment */}
                <select
                  value={order.paymentStatus}
                  disabled={loadingId === order._id}
                  onChange={(e) =>
                    handlePaymentChange(order._id, e.target.value)
                  }
                  className="px-2 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-green-600"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>

                {/* Delivery */}
                <select
                  onChange={(e) =>
                    handleAssignDelivery(order._id, e.target.value)
                  }
                  disabled={loadingId === order._id || order.deliveryAgent}
                  className="px-2 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-green-600"
                >
                  <option value="">
                    {order.deliveryAgent ? "Assigned" : "Assign Delivery"}
                  </option>

                  {!order.deliveryAgent &&
                    deliveries
                      .filter(d => d.isAvailable && d.isActive)
                      .map(d => (
                        <option key={d._id} value={d._id}>
                          {d.user?.name || "Agent"}
                        </option>
                      ))}
                </select>

                {/* View */}
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowModal(true);
                  }}
                  className="text-green-700 text-sm font-medium hover:underline"
                >
                  View
                </button>
              </div>
            </div>

            {/* ITEMS PREVIEW */}
            <div className="text-sm text-gray-600 space-y-1">
              {order.items.slice(0, 2).map((item, i) => (
                <p key={i}>
                  {item.name} × {item.quantity}
                </p>
              ))}

              {order.items.length > 2 && (
                <p className="text-xs text-gray-400">
                  +{order.items.length - 2} more items
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    )}

    {/* MODAL */}
    {showModal && selectedOrder && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-lg relative">

          {/* Close */}
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-3 right-4 text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Order Details
          </h2>

          {/* Info */}
          <div className="mb-4 space-y-1 text-sm text-gray-600">
            <p><b>ID:</b> {selectedOrder._id}</p>
            <p><b>Total:</b> ₹ {selectedOrder.totalAmount}</p>
            <p><b>Address:</b> {selectedOrder.address}</p>
          </div>

          {/* Status */}
          <div className="flex gap-6 mb-4 text-sm">

            <div>
              <p className="text-gray-400">Order</p>
              <p className="font-medium text-gray-800">
                {selectedOrder.status}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Payment</p>
              <p className="font-medium text-gray-800">
                {selectedOrder.paymentStatus}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Delivery</p>
              <p className={`font-medium ${
                selectedOrder.deliveryAgent
                  ? "text-green-600"
                  : "text-red-500"
              }`}>
                {selectedOrder.deliveryAgent ? "Assigned" : "Not Assigned"}
              </p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">
              Items
            </h3>

            <div className="divide-y">
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between py-2 text-sm">
                  <div>
                    <p>{item.name}</p>
                    <p className="text-gray-400 text-xs">
                      {item.attributes
                        ? Object.values(item.attributes).join(" / ")
                        : ""}
                    </p>
                  </div>

                  <div className="text-right">
                    <p>Qty: {item.quantity}</p>
                    <p>₹ {item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    )}
  </div>
);
}