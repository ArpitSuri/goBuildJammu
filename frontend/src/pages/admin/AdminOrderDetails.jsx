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
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Order Details</h1>

            {/* ---------------- ORDER INFO ---------------- */}
            <div className="border p-4 mb-4 rounded">
                <p><b>Order ID:</b> {order._id}</p>
                <p><b>Total:</b> ₹{order.totalAmount}</p>
                <p><b>Address:</b> {order.address}</p>
            </div>

            {/* ---------------- USER INFO ---------------- */}
            {order.user && (
                <div className="border p-4 mb-4 rounded">
                    <h2 className="font-semibold mb-2">User</h2>
                    <p>{order.user.name}</p>
                    <p>{order.user.email}</p>
                </div>
            )}

            {/* ---------------- STATUS CONTROLS ---------------- */}
            <div className="border p-4 mb-4 rounded flex gap-4">
                <div>
                    <p className="text-sm mb-1">Order Status</p>
                    <select
                        value={order.status}
                        disabled={loading}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="border px-3 py-1"
                    >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div>
                    <p className="text-sm mb-1">Payment Status</p>
                    <select
                        value={order.paymentStatus}
                        disabled={loading}
                        onChange={(e) => handlePaymentChange(e.target.value)}
                        className="border px-3 py-1"
                    >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
            </div>

            {/* ---------------- ITEMS ---------------- */}
            <div className="border p-4 rounded">
                <h2 className="font-semibold mb-3">Items</h2>

                {order.items.map((item, i) => (
                    <div
                        key={i}
                        className="flex justify-between border-b py-2"
                    >
                        <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">
                                {item.attributes
                                    ? Object.values(item.attributes).join(" / ")
                                    : ""}
                            </p>
                        </div>

                        <div className="text-right">
                            <p>Qty: {item.quantity}</p>
                            <p>₹{item.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}