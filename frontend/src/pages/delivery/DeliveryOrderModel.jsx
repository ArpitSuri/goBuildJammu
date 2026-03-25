import { useEffect, useState } from "react";
import { getDeliveryOrderById } from "../../../services/deliveryService";

export default function DeliveryOrderModal({ orderId, onClose }) {
    const [order, setOrder] = useState(null);

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        const { data } = await getDeliveryOrderById(orderId);
        setOrder(data);
    };

    if (!order) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white p-6 w-[600px] rounded">

                <h2 className="text-xl font-bold mb-4">
                    Order Details
                </h2>

                <p><b>Customer:</b> {order.user?.name}</p>
                <p><b>Phone:</b> {order.user?.phone}</p>

                <div className="mt-4">
                    <h3 className="font-semibold">Items:</h3>

                    {order.items.map((item, i) => (
                        <div key={i} className="border-b py-2">
                            <p>{item.name}</p>
                            <p className="text-sm text-gray-600">
                                Qty: {item.quantity} | ₹{item.price}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-4">
                    <h3 className="font-semibold">Address:</h3>
                    <p className="text-sm">{order.address?.fullAddress}</p>
                    <p className="text-sm">
                        {order.address?.city}, {order.address?.state}
                    </p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                    <p><b>Total:</b> ₹{order.totalAmount}</p>

                    <button
                        onClick={onClose}
                        className="px-4 py-2 border"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}