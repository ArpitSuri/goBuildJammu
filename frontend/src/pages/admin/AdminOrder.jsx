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
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Orders</h1>

            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div
                            key={order._id}
                            className="border p-4 rounded shadow-sm"
                        >
                            {/* HEADER */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">
                                        Order ID: {order._id}
                                    </p>
                                    <p>Total: ₹{order.totalAmount}</p>
                                </div>

                                {/* STATUS CONTROLS */}
                                <div className="flex gap-3">
                                    <select
                                        value={order.status}
                                        disabled={loadingId === order._id}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                order._id,
                                                e.target.value
                                            )
                                        }
                                        className="border px-2 py-1"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>

                                    <select
                                        value={order.paymentStatus}
                                        disabled={loadingId === order._id}
                                        onChange={(e) =>
                                            handlePaymentChange(
                                                order._id,
                                                e.target.value
                                            )
                                        }
                                        className="border px-2 py-1"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="failed">Failed</option>
                                    </select>

                                    <select
                                        onChange={(e) =>
                                            handleAssignDelivery(order._id, e.target.value)
                                        }
                                        disabled={loadingId === order._id || order.deliveryAgent}
                                        className="border px-2 py-1"
                                    >
                                        <option value="">
                                            {order.deliveryAgent ? "Assigned" : "Assign Delivery"}
                                        </option>

                                        {!order.deliveryAgent &&
                                            deliveries
                                                .filter(d => d.isAvailable && d.isActive)
                                                .map(d => (
                                                    <option key={d._id} value={d._id}>
                                                        {d.user?.name || "Delivery Agent"}
                                                    </option>
                                                ))
                                        }
                                    </select>
                                    
                                    <button
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setShowModal(true);
                                        }}
                                        className="text-blue-600 text-sm mt-2"
                                    >
                                        View Details
                                    </button>
    
                                </div>
                            </div>

                            {/* ITEMS */}
                            <div className="mt-3 space-y-1">
                                {order.items.map((item, i) => (
                                    <div key={i} className="text-sm">
                                        {item.name} × {item.quantity} = ₹{item.price}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-3xl p-6 rounded shadow-lg relative">

                        {/* CLOSE */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-2 right-3 text-lg"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold mb-4">Order Details</h2>

                        {/* ORDER INFO */}
                        <div className="mb-4 space-y-1">
                            <p><b>ID:</b> {selectedOrder._id}</p>
                            <p><b>Total:</b> ₹{selectedOrder.totalAmount}</p>
                            <p><b>Address:</b> {selectedOrder.address}</p>
                        </div>

                        {/* STATUS DISPLAY (READ ONLY) */}
                        <div className="flex gap-6 mb-4">

                            <div>
                                <p className="text-sm text-gray-500">Order Status</p>
                                <p className="font-medium">{selectedOrder.status}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Payment Status</p>
                                <p className="font-medium">{selectedOrder.paymentStatus}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Delivery</p>

                                {selectedOrder.deliveryAgent ? (
                                    <p className="text-green-600 font-medium">
                                        Assigned
                                    </p>
                                ) : (
                                    <p className="text-red-500 font-medium">
                                        Not Assigned
                                    </p>
                                )}
                            </div>

                        </div>

                        {/* ITEMS */}
                        <div>
                            <h3 className="font-semibold mb-2">Items</h3>

                            {selectedOrder.items.map((item, i) => (
                                <div key={i} className="flex justify-between border-b py-2">
                                    <div>
                                        <p>{item.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {item.attributes
                                                ? Object.values(item.attributes).join(" / ")
                                                : ""}
                                        </p>
                                    </div>

                                    <div>
                                        <p>Qty: {item.quantity}</p>
                                        <p>₹{item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}