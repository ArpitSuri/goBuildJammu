import { useState } from "react";
import { createOrder } from "../services/orderService";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleOrder = async () => {
        if (!address.trim()) {
            alert("Address is required");
            return;
        }

        try {
            setLoading(true);

            const { data } = await createOrder(address);

            // redirect to order page
            navigate(`/orders/${data.order._id}`);
        } catch (err) {
            alert(err.response?.data?.message || "Order failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Checkout</h2>

            <textarea
                placeholder="Enter delivery address"
                className="w-full border p-3 mb-4"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />

            <button
                onClick={handleOrder}
                disabled={loading}
                className="bg-black text-white px-6 py-2"
            >
                {loading ? "Placing Order..." : "Place Order"}
            </button>
        </div>
    );
}