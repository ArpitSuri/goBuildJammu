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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow-lg max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Order Details
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* CUSTOMER */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">Customer</p>
          <p className="text-gray-800 font-medium">
            {order.user?.name}
          </p>
          <p className="text-sm text-gray-600">
            {order.user?.phone}
          </p>
        </div>

        {/* ITEMS */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Items</p>

          <div className="divide-y border rounded-lg">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between px-4 py-3">

                <div>
                  <p className="text-gray-800 font-medium">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="text-sm font-medium text-gray-800">
                  ₹ {item.price}
                </p>

              </div>
            ))}
          </div>
        </div>

        {/* ADDRESS */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">Delivery Address</p>
          <p className="text-sm text-gray-700">
            {order.address?.fullAddress}
          </p>
          <p className="text-sm text-gray-600">
            {order.address?.city}, {order.address?.state}
          </p>
        </div>

        {/* TOTAL */}
        <div className="flex justify-between items-center border-t pt-4">
          <p className="text-gray-600">
            Total
          </p>
          <p className="text-lg font-semibold text-gray-800">
            ₹ {order.totalAmount}
          </p>
        </div>

        {/* ACTION */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}