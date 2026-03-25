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
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">My Deliveries</h1>

            <div className="grid gap-4">
                {orders.map(order => (
                    <div
                        key={order._id}
                        className="border p-4 rounded flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold">
                                Order #{order._id.slice(-6)}
                            </p>
                            <p className="text-sm text-gray-600">
                                {order.user?.name} | {order.user?.phone}
                            </p>
                            <p className="text-sm">
                                Status: <b>{order.status}</b>
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelected(order._id)}
                                className="px-3 py-1 border"
                            >
                                View
                            </button>

                            {order.status === "assigned" && (
                                <button
                                    onClick={() =>
                                        handleStatus(order._id, "picked")
                                    }
                                    disabled={loadingId === order._id}
                                    className="px-3 py-1 bg-blue-500 text-white"
                                >
                                    Pick
                                </button>
                            )}

                            {order.status === "picked" && (
                                <button
                                    onClick={() =>
                                        handleStatus(order._id, "shipped")
                                    }
                                    disabled={loadingId === order._id}
                                    className="px-3 py-1 bg-yellow-500 text-white"
                                >
                                    Ship
                                </button>
                            )}

                            {order.status === "shipped" && (
                                <button
                                    onClick={() =>
                                        handleStatus(order._id, "delivered")
                                    }
                                    disabled={loadingId === order._id}
                                    className="px-3 py-1 bg-green-600 text-white"
                                >
                                    Deliver
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {selected && (
                <DeliveryOrderModal
                    orderId={selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    );
}