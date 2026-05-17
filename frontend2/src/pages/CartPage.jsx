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
        // Prevent increasing more than available stock
        if (variant?.stock && qty > variant.stock) {
            alert(`Sorry, only ${variant.stock} units available.`);
            return;
        }
        if (qty < 1) return;
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
        if (window.confirm("Are you sure you want to empty your cart?")) {
            await clearCart();
            fetchCart();
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500 animate-pulse font-medium">Loading your items...</p>
        </div>
    );

    if (!cart.items || cart.items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <div className="text-7xl mb-6">🛒</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
                <button
                    onClick={() => navigate("/")}
                    className="bg-black text-white px-10 py-4 text-[12px] font-medium tracking-widest uppercase hover:bg-gray-900 border border-black transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-none rounded-full"
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    const total = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex justify-between items-baseline mb-10 border-b border-gray-100 pb-6">
                <h1 className="text-4xl font-black text-gray-950 tracking-tight">Your Cart</h1>
                <span className="text-gray-400 font-medium">{cart.items.length} Items</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* LEFT: ITEM LIST */}
                <div className="lg:col-span-2 space-y-8">
                    {cart.items.map((item) => {
                        const variant = item.variant;
                        const product = variant?.product;
                        const itemImage = product?.images?.[0]?.url;
                        const isDiscounted = item.price < variant?.price;

                        return (
                            <div key={item._id} className="flex flex-col sm:flex-row gap-6 group relative">
                                {/* Image Container */}
                                <div className="w-full sm:w-32 h-32 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                                    {itemImage ? (
                                        <img src={itemImage} alt={item.name} className="w-full h-full object-contain p-3 mix-blend-multiply" />
                                    ) : (
                                        <div className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">No Image</div>
                                    )}
                                </div>

                                {/* Info Column */}
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mb-1">
                                                    {product?.brand || "Brand"}
                                                </p>
                                                <h3 className="font-light text-black text-xl leading-tight mb-1">
                                                    {item.name}
                                                </h3>
                                                <p className="text-[12px] text-gray-400 font-light">SKU: {variant?.sku}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-black text-xl">
                                                    Rs. {(item.price * item.quantity).toLocaleString()}
                                                </p>
                                                <p className="text-[12px] text-gray-400 font-light">
                                                    Rs. {item.price.toLocaleString()} / unit
                                                </p>
                                            </div>
                                        </div>

                                        {isDiscounted && (
                                            <span className="inline-block mt-2 bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded border border-green-100">
                                                SAVE RS. {(variant.price - item.price).toLocaleString()}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden">
                                            <button
                                                disabled={item.quantity <= 1}
                                                onClick={() => handleQtyChange(variant, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors disabled:opacity-20"
                                            >
                                                −
                                            </button>
                                            <span className="w-10 text-center font-medium text-[13px] text-black">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQtyChange(variant, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => handleRemove(variant)}
                                            className="text-xs font-bold text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors uppercase tracking-tighter"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* RIGHT: SUMMARY CARD */}
                <div className="lg:sticky lg:top-8 h-fit font-sans">
                    <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                        <h2 className="text-lg font-light text-black tracking-tight mb-8">Order Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-600 font-medium">
                                <span>Subtotal</span>
                                <span>Rs. {total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 font-medium">
                                <span>Shipping</span>
                                <span className="text-green-700 text-sm font-bold uppercase">Calculated at Checkout</span>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex justify-between items-end">
                                <span className="font-bold text-gray-900">Total</span>
                                <div className="text-right">
                                    <p className="text-3xl font-black text-gray-950">Rs. {total.toLocaleString()}</p>
                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-1">Inclusive of all taxes</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate("/checkout")}
                            className="w-full bg-black text-white text-[12px] font-medium tracking-widest uppercase py-4 border border-black hover:bg-gray-900 transition-all duration-300 mb-4 shadow-lg shadow-black/10 hover:shadow-none rounded-full"
                        >
                            Proceed to Checkout
                        </button>

                        <button
                            onClick={handleClear}
                            className="w-full text-xs font-bold text-gray-400 hover:text-red-500 transition-colors py-2 uppercase tracking-widest"
                        >
                            Clear Cart
                        </button>
                    </div>

                    {/* HELP BOX */}
                    <div className="mt-6 p-5 bg-gray-50 border border-gray-100 rounded-2xl flex gap-4">
                        <span className="text-xl opacity-60">🛡️</span>
                        <div>
                            <p className="text-[12px] font-medium text-black tracking-widest uppercase mb-1">Secure Checkout</p>
                            <p className="text-[11px] text-gray-500 font-light leading-relaxed">Your data is protected by industry-standard encryption.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}