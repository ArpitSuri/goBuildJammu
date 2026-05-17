// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getVariantsByProduct } from "../services/variantService";
// import { addToCart } from "../services/cartService";

// export default function ProductCard({ product }) {
//     const navigate = useNavigate();
//     const [variants, setVariants] = useState([]);
//     const [selectedVariant, setSelectedVariant] = useState(null);
//     const [quantity, setQuantity] = useState(1);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         fetchVariants();
//     }, [product._id]);

//     const fetchVariants = async () => {
//         try {
//             const { data } = await getVariantsByProduct(product._id);
//             setVariants(data.variants);
//             if (data.variants.length > 0) {
//                 setSelectedVariant(data.variants[0]);
//             }
//         } catch (err) {
//             console.error("Failed to fetch variants", err);
//         }
//     };

//     const handleAddToCart = async (e) => {
//         e.stopPropagation();
//         if (!selectedVariant || isSoldOut) return;

//         try {
//             setLoading(true);
//             await addToCart(selectedVariant._id, quantity);
//             alert("Successfully added to cart!");
//             window.dispatchEvent(new Event('cartUpdated'));
//         } catch (err) {
//             alert(err.response?.data?.message || "Failed to add to cart");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Helper logic
//     const actualPrice = selectedVariant
//         ? (selectedVariant.discountPrice || selectedVariant.price)
//         : product.minPrice;

//     const originalPrice = selectedVariant?.discountPrice ? selectedVariant.price : null;

//     const discountPercent = originalPrice && actualPrice
//         ? Math.round(((originalPrice - actualPrice) / originalPrice) * 100)
//         : 0;

//     // Check if the current variant is out of stock
//     const isSoldOut = selectedVariant ? selectedVariant.stock <= 0 : false;

//     return (
//         <div
//             onClick={() => navigate(`/product/${product._id}`)}
//             className="flex flex-col bg-white border border-transparent hover:shadow-lg transition-shadow cursor-pointer relative pb-3"
//         >
//             {/* Top Image Box */}
//             <div className="relative h-[220px] bg-white flex items-center justify-center p-2 mb-2">
//                 {/* OFF Badge */}
//                 {discountPercent > 0 && !isSoldOut && (
//                     <div className="absolute top-2 left-2 bg-[#FADB5F] text-black text-[10px] font-bold px-1.5 py-[2px] rounded-[2px] z-10">
//                         {discountPercent}% OFF
//                     </div>
//                 )}

//                 {/* SOLD OUT Overlay */}
//                 {isSoldOut && (
//                     <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20">
//                         <span className="bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-sm shadow-md">
//                             SOLD OUT
//                         </span>
//                     </div>
//                 )}

//                 {/* Product Image - Fixed from JSON */}
//                 {product.images && product.images.length > 0 ? (
//                     <img
//                         src={product.images[0].url}
//                         alt={product.name}
//                         className={`w-full h-full object-contain ${isSoldOut ? 'grayscale' : ''}`}
//                     />
//                 ) : (
//                     <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400 text-xs">NO IMAGE</div>
//                 )}
//             </div>

//             {/* Content Body */}
//             <div className="px-3 flex flex-col flex-grow">
//                 <h3 className="text-[13px] font-bold text-gray-900 leading-[1.3] h-[34px] overflow-hidden mb-1">
//                     {product.name}
//                 </h3>

//                 <div className="flex items-baseline gap-2 mt-2">
//                     {originalPrice && (
//                         <span className="text-[11px] text-gray-500 line-through">
//                             Rs. {originalPrice.toLocaleString()}
//                         </span>
//                     )}
//                     <span className="text-[15px] font-medium text-gray-900">
//                         {actualPrice ? `Rs. ${actualPrice.toLocaleString()}` : "Price N/A"}
//                     </span>
//                 </div>

//                 <div className="flex-grow min-h-[16px]"></div>

//                 <div onClick={(e) => e.stopPropagation()} className="space-y-3 mt-4">
//                     {/* Variant Selector */}
//                     {variants.length > 0 ? (
//                         <div>
//                             <label className="text-[11px] text-green-800 block mb-1">Select Option</label>
//                             <select
//                                 value={selectedVariant?._id || ""}
//                                 onChange={(e) => {
//                                     const v = variants.find(v => v._id === e.target.value);
//                                     if (v) setSelectedVariant(v);
//                                 }}
//                                 className="w-full border border-green-600 rounded-md px-2 py-1.5 text-[12px] bg-white focus:outline-none"
//                             >
//                                 {variants.map(v => (
//                                     <option key={v._id} value={v._id}>
//                                         {v.attributes?.map(a => a.value).join(" / ") || "Default"}
//                                         {v.stock <= 0 ? " (Out of Stock)" : ""}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     ) : (
//                         <div className="h-[43px] flex items-center text-xs text-gray-400 italic">No options available</div>
//                     )}

//                     {/* Quantity & Add Button */}
//                     <div className="flex gap-2 pt-1">
//                         <div className="flex items-center justify-between border border-green-600 rounded-md w-[70px] px-2.5 py-1.5 bg-white">
//                             <span onClick={() => !isSoldOut && setQuantity(q => Math.max(1, q - 1))} className="cursor-pointer">-</span>
//                             <span>{quantity}</span>
//                             <span onClick={() => !isSoldOut && setQuantity(q => q + 1)} className="cursor-pointer">+</span>
//                         </div>
//                         <button
//                             onClick={handleAddToCart}
//                             disabled={loading || isSoldOut || variants.length === 0}
//                             className={`flex-grow text-white text-[13px] font-semibold py-1.5 rounded-md transition-colors ${isSoldOut ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#347b22] hover:bg-green-800'
//                                 }`}
//                         >
//                             {loading ? "ADDING..." : isSoldOut ? "OUT OF STOCK" : "ADD"}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

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
    const [added, setAdded] = useState(false);

    useEffect(() => {
        fetchVariants();
    }, [product._id]);

    const fetchVariants = async () => {
        try {
            const { data } = await getVariantsByProduct(product._id);
            setVariants(data.variants);
            // use preSelectedVariant if passed in (e.g. from BestDeals)
            if (product.preSelectedVariant) {
                setSelectedVariant(product.preSelectedVariant);
            } else if (data.variants.length > 0) {
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
            setAdded(true);
            window.dispatchEvent(new Event("cartUpdated"));
            setTimeout(() => setAdded(false), 1800);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add to cart");
        } finally {
            setLoading(false);
        }
    };

    const actualPrice = selectedVariant
        ? (selectedVariant.discountPrice || selectedVariant.price)
        : product.minPrice;

    const originalPrice = selectedVariant?.discountPrice ? selectedVariant.price : null;

    const discountPercent = originalPrice && actualPrice
        ? Math.round(((originalPrice - actualPrice) / originalPrice) * 100)
        : 0;

    const isSoldOut = selectedVariant ? selectedVariant.stock <= 0 : false;

    return (
        <div
            className="flex flex-col bg-white border border-gray-100 hover:border-gray-200 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-3xl cursor-pointer transition-all duration-300 relative font-sans group overflow-hidden"
            onClick={() => navigate(`/product/${product._id}`)}
        >
            {/* Top Image Box */}
            <div className="relative h-[240px] bg-gray-50/50 flex items-center justify-center p-6 overflow-hidden">
                {/* OFF Badge */}
                {discountPercent > 0 && !isSoldOut && (
                    <div className="absolute top-3 left-3 bg-white border border-gray-100 text-black text-[10px] font-medium tracking-widest px-3 py-1.5 z-10 shadow-sm rounded-full">
                        {discountPercent}% OFF
                    </div>
                )}

                {/* SOLD OUT Overlay */}
                {isSoldOut && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center z-20">
                        <span className="bg-white border border-gray-200 text-black text-[11px] font-medium tracking-widest uppercase px-5 py-2 shadow-sm rounded-full">
                            SOLD OUT
                        </span>
                    </div>
                )}

                {/* Product Image */}
                {product.images && product.images.length > 0 ? (
                    <img
                        src={product.images[0].url}
                        alt={product.name}
                        className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105 ${isSoldOut ? 'grayscale opacity-60' : ''}`}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-[11px] font-light tracking-widest uppercase">No Image</div>
                )}
            </div>

            {/* Content Body */}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-[15px] font-medium text-gray-800 leading-relaxed min-h-[44px] overflow-hidden line-clamp-2 mb-3">
                    {product.name}
                </h3>

                <div className="flex items-center gap-3 mb-5">
                    {originalPrice && (
                        <span className="text-[13px] text-gray-400 line-through font-light">
                            Rs. {originalPrice.toLocaleString()}
                        </span>
                    )}
                    <span className="text-[16px] font-semibold text-black">
                        {actualPrice ? `Rs. ${actualPrice.toLocaleString()}` : "Price N/A"}
                    </span>
                </div>

                <div className="flex-grow"></div>

                <div onClick={(e) => e.stopPropagation()} className="mt-4 space-y-4">
                    {/* Variant Selector */}
                    {variants.length > 1 && (
                        <div className="relative">
                            <select
                                value={selectedVariant?._id || ""}
                                onChange={(e) => {
                                    const v = variants.find(v => v._id === e.target.value);
                                    if (v) setSelectedVariant(v);
                                }}
                                className="w-full appearance-none border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-gray-300 rounded-full pl-4 pr-10 py-2.5 text-[13px] font-medium tracking-wide text-gray-700 focus:outline-none focus:border-black transition-all cursor-pointer shadow-sm"
                            >
                                {variants.map(v => (
                                    <option key={v._id} value={v._id}>
                                        {v.attributes?.map(a => a.value).join(" / ") || "Default"}
                                        {v.stock <= 0 ? " (Out of Stock)" : ""}
                                    </option>
                                ))}
                            </select>
                            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    )}

                    {/* Quantity & Add Button */}
                    <div className="flex gap-2.5">
                        <div className="flex items-center justify-between border border-gray-200 w-[85px] px-1 py-0 bg-white rounded-full shadow-sm hover:border-gray-300 transition-colors shrink-0">
                            <button 
                                onClick={() => !isSoldOut && setQuantity(q => Math.max(1, q - 1))} 
                                disabled={quantity <= 1 || isSoldOut}
                                className="text-gray-400 hover:text-black w-7 h-11 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium text-lg"
                            >
                                −
                            </button>
                            <span className="text-[13px] font-medium text-black">{quantity}</span>
                            <button 
                                onClick={() => !isSoldOut && setQuantity(q => q + 1)} 
                                disabled={isSoldOut}
                                className="text-gray-400 hover:text-black w-7 h-11 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium text-lg"
                            >
                                +
                            </button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={loading || isSoldOut || variants.length === 0}
                            className={`flex-grow border h-11 flex items-center justify-center px-2 text-[10px] xl:text-[11px] font-bold tracking-widest uppercase whitespace-nowrap transition-all duration-300 rounded-full shadow-md hover:shadow-lg hover:-translate-y-[1px] ${
                                added 
                                ? 'bg-white border-black text-black' 
                                : isSoldOut || variants.length === 0
                                    ? 'bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed shadow-none hover:-translate-y-0'
                                    : 'bg-black border-black text-white hover:bg-gray-900'
                            }`}
                        >
                            {loading ? "..." : added ? "Added" : isSoldOut ? "Sold Out" : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}