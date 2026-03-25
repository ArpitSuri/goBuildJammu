import { useEffect, useState } from "react";
import { getMyOrders } from "../../services/orderService";
import { Link } from "react-router-dom";
import { ChevronRight, Package, Clock } from "lucide-react"; // Optional icons

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await getMyOrders();
            setOrders(data.orders);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        const styles = {
            pending: "bg-amber-100 text-amber-700 border-amber-200",
            confirmed: "bg-blue-100 text-blue-700 border-blue-200",
            delivered: "bg-green-100 text-green-700 border-green-200",
            cancelled: "bg-red-100 text-red-700 border-red-200",
        };
        return styles[status] || "bg-gray-100 text-gray-700 border-gray-200";
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-600"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                    {orders.length} Orders Total
                </span>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                    <Package className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
                    <Link to="/" className="mt-4 inline-block text-yellow-600 font-semibold hover:underline">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div
                            key={order._id}
                            className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                        >
                            <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono text-gray-400">#{order._id.slice(-8).toUpperCase()}</span>
                                        <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded border ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 truncate max-w-[250px]">
                                        {order.items[0]?.name}
                                        {order.items.length > 1 && <span className="text-gray-400 font-normal"> +{order.items.length - 1} more</span>}
                                    </h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Clock size={14} />
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between md:justify-end md:gap-8 border-t md:border-t-0 pt-3 md:pt-0">
                                    <div className="text-left md:text-right">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">Total Amount</p>
                                        <p className="font-bold text-gray-900 text-lg">₹{order.totalAmount.toLocaleString()}</p>
                                    </div>

                                    <Link
                                        to={`/orders/${order._id}`}
                                        className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-100 transition-colors"
                                    >
                                        Details
                                        <ChevronRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}