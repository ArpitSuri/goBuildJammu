import { useEffect, useState } from "react";
import { getMyOrders } from "../../services/orderService";
import { Link } from "react-router-dom";

export default function MyOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await getMyOrders();
            setOrders(data.orders);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">My Orders</h2>

            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                orders.map(order => (
                    <div
                        key={order._id}
                        className="border p-4 mb-3 flex justify-between"
                    >
                        <div>
                            <p>Order ID: {order._id}</p>
                            <p>Status: {order.status}</p>
                            <p>Amount: ₹{order.totalAmount}</p>
                        </div>

                        <Link
                            to={`/orders/${order._id}`}
                            className="text-blue-500"
                        >
                            View
                        </Link>
                    </div>
                ))
            )}
        </div>
    );
}