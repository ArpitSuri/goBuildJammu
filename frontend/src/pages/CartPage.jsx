import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../../services/cartService";

export default function CartPage() {
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const { data } = await getCart();
            setCart(data || { items: [] });
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const getVariantId = (variant) =>
        typeof variant === "object" ? variant._id : variant;

    const handleQtyChange = async (variant, qty) => {
        if (qty < 1) return; // prevent useless calls

        const variantId = getVariantId(variant);

        await updateCartItem(variantId, qty);
        fetchCart();
    };

    const handleRemove = async (variant) => {
        const variantId = getVariantId(variant);
        await removeCartItem(variantId);
        fetchCart();
    };

    const handleClear = async () => {
        await clearCart();
        fetchCart();
    };

    if (loading) return <p>Loading...</p>;

    if (!cart.items.length) {
        return <p className="p-6">Cart is empty</p>;
    }

    const total = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-xl font-semibold mb-4">Your Cart</h1>

            <div className="space-y-4">
                {cart.items.map((item) => {
                    const variantId = getVariantId(item.variant);

                    return (
                        <div
                            key={variantId}
                            className="border p-4 rounded flex justify-between items-center"
                        >
                            <div>
                                <p className="font-medium">{item.name}</p>

                                <p className="text-sm text-gray-500">
                                    {item.attributes
                                        ? Object.values(item.attributes).join(" / ")
                                        : ""}
                                </p>

                                <p className="text-sm">₹{item.price}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    disabled={item.quantity <= 1}
                                    onClick={() =>
                                        handleQtyChange(
                                            item.variant,
                                            item.quantity - 1
                                        )
                                    }
                                >
                                    -
                                </button>

                                <span>{item.quantity}</span>

                                <button
                                    onClick={() =>
                                        handleQtyChange(
                                            item.variant,
                                            item.quantity + 1
                                        )
                                    }
                                >
                                    +
                                </button>

                                <button
                                    onClick={() => handleRemove(item.variant)}
                                    className="text-red-600 ml-4"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 border-t pt-4 flex justify-between">
                <h2 className="font-semibold">Total</h2>
                <h2 className="font-semibold">₹{total}</h2>
            </div>

            <button
                onClick={handleClear}
                className="mt-4 text-red-600"
            >
                Clear Cart
            </button>
            <button
                onClick={() => navigate("/checkout")}
                className="bg-black text-white px-6 py-2 rounded"
            >
                Proceed to Checkout
            </button>
        </div>
    );
}