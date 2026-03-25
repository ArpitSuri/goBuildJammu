import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVariantsByProduct } from "../services/variantService";
import { addToCart } from "../services/cartService";

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchVariants();
    }, [product._id]);

    const fetchVariants = async () => {
        try {
            const { data } = await getVariantsByProduct(product._id);
            setVariants(data.variants);
            if (data.variants.length > 0) {
                setSelectedVariant(data.variants[0]);
            }
        } catch (err) {
            console.error("Failed to fetch variants", err);
        }
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (!selectedVariant || isSoldOut) return;

        try {
            setLoading(true);
            await addToCart(selectedVariant._id, quantity);
            alert("Successfully added to cart!");
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add to cart");
        } finally {
            setLoading(false);
        }
    };

    // Helper logic
    const actualPrice = selectedVariant
        ? (selectedVariant.discountPrice || selectedVariant.price)
        : product.minPrice;

    const originalPrice = selectedVariant?.discountPrice ? selectedVariant.price : null;

    const discountPercent = originalPrice && actualPrice
        ? Math.round(((originalPrice - actualPrice) / originalPrice) * 100)
        : 0;

    // Check if the current variant is out of stock
    const isSoldOut = selectedVariant ? selectedVariant.stock <= 0 : false;

    return (
        <div
            onClick={() => navigate(`/product/${product._id}`)}
            className="flex flex-col bg-white border border-transparent hover:shadow-lg transition-shadow cursor-pointer relative pb-3"
        >
            {/* Top Image Box */}
            <div className="relative h-[220px] bg-white flex items-center justify-center p-2 mb-2">
                {/* OFF Badge */}
                {discountPercent > 0 && !isSoldOut && (
                    <div className="absolute top-2 left-2 bg-[#FADB5F] text-black text-[10px] font-bold px-1.5 py-[2px] rounded-[2px] z-10">
                        {discountPercent}% OFF
                    </div>
                )}

                {/* SOLD OUT Overlay */}
                {isSoldOut && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20">
                        <span className="bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-sm shadow-md">
                            SOLD OUT
                        </span>
                    </div>
                )}

                {/* Product Image - Fixed from JSON */}
                {product.images && product.images.length > 0 ? (
                    <img
                        src={product.images[0].url}
                        alt={product.name}
                        className={`w-full h-full object-contain ${isSoldOut ? 'grayscale' : ''}`}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400 text-xs">NO IMAGE</div>
                )}
            </div>

            {/* Content Body */}
            <div className="px-3 flex flex-col flex-grow">
                <h3 className="text-[13px] font-bold text-gray-900 leading-[1.3] h-[34px] overflow-hidden mb-1">
                    {product.name}
                </h3>

                <div className="flex items-baseline gap-2 mt-2">
                    {originalPrice && (
                        <span className="text-[11px] text-gray-500 line-through">
                            Rs. {originalPrice.toLocaleString()}
                        </span>
                    )}
                    <span className="text-[15px] font-medium text-gray-900">
                        {actualPrice ? `Rs. ${actualPrice.toLocaleString()}` : "Price N/A"}
                    </span>
                </div>

                <div className="flex-grow min-h-[16px]"></div>

                <div onClick={(e) => e.stopPropagation()} className="space-y-3 mt-4">
                    {/* Variant Selector */}
                    {variants.length > 0 ? (
                        <div>
                            <label className="text-[11px] text-green-800 block mb-1">Select Option</label>
                            <select
                                value={selectedVariant?._id || ""}
                                onChange={(e) => {
                                    const v = variants.find(v => v._id === e.target.value);
                                    if (v) setSelectedVariant(v);
                                }}
                                className="w-full border border-green-600 rounded-md px-2 py-1.5 text-[12px] bg-white focus:outline-none"
                            >
                                {variants.map(v => (
                                    <option key={v._id} value={v._id}>
                                        {v.attributes?.map(a => a.value).join(" / ") || "Default"}
                                        {v.stock <= 0 ? " (Out of Stock)" : ""}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="h-[43px] flex items-center text-xs text-gray-400 italic">No options available</div>
                    )}

                    {/* Quantity & Add Button */}
                    <div className="flex gap-2 pt-1">
                        <div className="flex items-center justify-between border border-green-600 rounded-md w-[70px] px-2.5 py-1.5 bg-white">
                            <span onClick={() => !isSoldOut && setQuantity(q => Math.max(1, q - 1))} className="cursor-pointer">-</span>
                            <span>{quantity}</span>
                            <span onClick={() => !isSoldOut && setQuantity(q => q + 1)} className="cursor-pointer">+</span>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={loading || isSoldOut || variants.length === 0}
                            className={`flex-grow text-white text-[13px] font-semibold py-1.5 rounded-md transition-colors ${isSoldOut ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#347b22] hover:bg-green-800'
                                }`}
                        >
                            {loading ? "ADDING..." : isSoldOut ? "OUT OF STOCK" : "ADD"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}