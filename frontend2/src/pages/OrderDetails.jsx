import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../services/orderService";
import { Package, MapPin, CreditCard, Calendar } from "lucide-react"; // Optional: icons

export default function OrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await getOrderById(id);
                setOrder(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOrder();
    }, [id]);

    if (!order) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    const statusColors = {
        pending: "bg-yellow-100 text-yellow-700",
        completed: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700",
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</h2>
                    <p className="text-gray-500 flex items-center gap-2 mt-1">
                        <Calendar size={16} /> {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <span className={`px-4 py-1 rounded-full text-sm font-semibold uppercase ${statusColors[order.status] || 'bg-gray-100'}`}>
                    {order.status}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Items */}
                <div className="md:col-span-2 space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                <Package size={18} /> Order Items
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.items.map((item, i) => (
                                <div key={i} className="p-4 flex gap-4 items-center hover:bg-gray-50 transition">
                                    {/* IMAGE BOX */}
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border">
                                        {item.product?.images?.[0]?.url || item.image ? (
                                            <img
                                                src={item.product?.images?.[0]?.url || item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    {/* DETAILS */}
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{item.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>

                                    <p className="font-semibold text-gray-900">₹{item.price.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary & Shipping */}
                <div className="space-y-6">
                    {/* Summary */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{order.totalAmount}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between text-lg font-bold text-gray-900">
                                <span>Total</span>
                                <span>₹{order.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery & Payment Info */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="mb-6">
                            <h4 className="flex items-center gap-2 font-bold text-gray-700 mb-2">
                                <MapPin size={18} className="text-blue-500" /> Delivery Address
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{order.address}</p>
                        </div>
                        <div>
                            <h4 className="flex items-center gap-2 font-bold text-gray-700 mb-2">
                                <CreditCard size={18} className="text-purple-500" /> Payment Info
                            </h4>
                            <p className="text-sm text-gray-600 uppercase">Method: {order.paymentMethod}</p>
                            <p className={`text-xs mt-1 font-medium ${order.paymentStatus === 'pending' ? 'text-orange-500' : 'text-green-600'}`}>
                                Status: {order.paymentStatus}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}