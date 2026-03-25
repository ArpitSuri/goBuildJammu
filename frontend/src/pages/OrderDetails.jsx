import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../services/orderService";

export default function OrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

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

    if (!order) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>

            <p>Status: {order.status}</p>
            <p>Payment: {order.paymentStatus}</p>
            <p>Total: ₹{order.totalAmount}</p>

            <h3 className="mt-4 font-semibold">Items</h3>

            {order.items.map((item, i) => (
                <div key={i} className="border p-3 mt-2">
                    <p>{item.name}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>Price: ₹{item.price}</p>
                </div>
            ))}
        </div>
    );
}