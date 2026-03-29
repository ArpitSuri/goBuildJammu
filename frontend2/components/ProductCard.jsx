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
        <>
            <style>{`
                .hr-pc {
                    display: flex;
                    flex-direction: column;
                    background: #fff;
                    border: 1px solid #e8e8e8;
                    border-radius: 10px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: box-shadow 0.22s ease, transform 0.22s ease;
                    position: relative;
                    font-family: 'Inter', sans-serif;
                }
                .hr-pc:hover {
                    box-shadow: 0 8px 28px rgba(0,0,0,0.1);
                    transform: translateY(-2px);
                }
                .hr-pc-img-wrap {
                    position: relative;
                    height: 200px;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 16px;
                    border-bottom: 1px solid #f0f0f0;
                }
                .hr-pc-img-wrap img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
                .hr-pc-badge {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: #FFD700;
                    color: #111;
                    font-size: 11px;
                    font-weight: 700;
                    padding: 3px 8px;
                    border-radius: 4px;
                    z-index: 2;
                }
                .hr-pc-soldout-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(255,255,255,0.65);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 3;
                }
                .hr-pc-soldout-tag {
                    background: #dc2626;
                    color: #fff;
                    font-size: 12px;
                    font-weight: 700;
                    padding: 6px 14px;
                    border-radius: 4px;
                    letter-spacing: 0.5px;
                }
                .hr-pc-body {
                    padding: 12px 14px;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                }
                .hr-pc-name {
                    font-size: 13.5px;
                    font-weight: 600;
                    color: #111;
                    line-height: 1.35;
                    min-height: 36px;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    margin: 0 0 10px;
                }
                .hr-pc-prices {
                    display: flex;
                    align-items: baseline;
                    gap: 8px;
                    margin-bottom: 10px;
                }
                .hr-pc-price-main {
                    font-size: 16px;
                    font-weight: 700;
                    color: #111;
                }
                .hr-pc-price-old {
                    font-size: 13px;
                    color: #aaa;
                    text-decoration: line-through;
                }
                /* Variant selector */
                .hr-pc-select {
                    width: 100%;
                    border: 1.5px solid #22c55e;
                    border-radius: 6px;
                    padding: 6px 8px;
                    font-size: 12px;
                    font-family: 'Inter', sans-serif;
                    color: #333;
                    background: #fff;
                    outline: none;
                    cursor: pointer;
                    margin-bottom: 10px;
                }
                .hr-pc-select:focus { border-color: #16a34a; }
                /* Qty + Add row */
                .hr-pc-actions {
                    display: flex;
                    gap: 8px;
                    margin-top: auto;
                }
                .hr-pc-qty {
                    display: flex;
                    align-items: center;
                    border: 1.5px solid #22c55e;
                    border-radius: 6px;
                    overflow: hidden;
                    min-width: 70px;
                }
                .hr-pc-qty-btn {
                    background: #f0fdf4;
                    border: none;
                    width: 26px;
                    height: 34px;
                    font-size: 16px;
                    cursor: pointer;
                    color: #16a34a;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.15s;
                    padding: 0;
                    flex-shrink: 0;
                }
                .hr-pc-qty-btn:hover:not(:disabled) { background: #dcfce7; }
                .hr-pc-qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }
                .hr-pc-qty-val {
                    flex: 1;
                    text-align: center;
                    font-size: 14px;
                    font-weight: 600;
                    color: #111;
                    padding: 0 2px;
                }
                .hr-pc-add-btn {
                    flex: 1;
                    background: #16a34a;
                    color: #fff;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    letter-spacing: 0.3px;
                    transition: background 0.2s;
                    height: 36px;
                }
                .hr-pc-add-btn:hover:not(:disabled) { background: #15803d; }
                .hr-pc-add-btn.added { background: #0d9488; }
                .hr-pc-add-btn:disabled { background: #9ca3af; cursor: not-allowed; }
                .hr-pc-no-img {
                    width: 100%;
                    height: 100%;
                    background: #f5f5f5;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #ccc;
                    font-size: 12px;
                }
            `}</style>

            <div
                className="hr-pc"
                onClick={() => navigate(`/product/${product._id}`)}
            >
                {/* Image */}
                <div className="hr-pc-img-wrap">
                    {discountPercent > 0 && !isSoldOut && (
                        <div className="hr-pc-badge">{discountPercent}% OFF</div>
                    )}
                    {isSoldOut && (
                        <div className="hr-pc-soldout-overlay">
                            <span className="hr-pc-soldout-tag">SOLD OUT</span>
                        </div>
                    )}
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={product.images[0].url}
                            alt={product.name}
                            style={{ filter: isSoldOut ? "grayscale(1)" : "none" }}
                        />
                    ) : (
                        <div className="hr-pc-no-img">NO IMAGE</div>
                    )}
                </div>

                {/* Body */}
                <div className="hr-pc-body">
                    <p className="hr-pc-name">{product.name}</p>

                    <div className="hr-pc-prices">
                        {originalPrice && (
                            <span className="hr-pc-price-old">Rs. {originalPrice.toLocaleString()}</span>
                        )}
                        <span className="hr-pc-price-main">
                            {actualPrice ? `Rs. ${actualPrice.toLocaleString()}` : "Price N/A"}
                        </span>
                    </div>

                    {/* Variant select */}
                    {variants.length > 1 && (
                        <div onClick={e => e.stopPropagation()}>
                            <select
                                className="hr-pc-select"
                                value={selectedVariant?._id || ""}
                                onChange={e => {
                                    const v = variants.find(v => v._id === e.target.value);
                                    if (v) setSelectedVariant(v);
                                }}
                            >
                                {variants.map(v => (
                                    <option key={v._id} value={v._id}>
                                        {v.attributes?.map(a => a.value).join(" / ") || "Default"}
                                        {v.stock <= 0 ? " (Out of Stock)" : ""}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Add to cart row */}
                    <div className="hr-pc-actions" onClick={e => e.stopPropagation()}>
                        <div className="hr-pc-qty">
                            <button
                                className="hr-pc-qty-btn"
                                disabled={quantity <= 1 || isSoldOut}
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            >−</button>
                            <span className="hr-pc-qty-val">{quantity}</span>
                            <button
                                className="hr-pc-qty-btn"
                                disabled={isSoldOut}
                                onClick={() => setQuantity(q => q + 1)}
                            >+</button>
                        </div>
                        <button
                            className={`hr-pc-add-btn${added ? " added" : ""}`}
                            onClick={handleAddToCart}
                            disabled={loading || isSoldOut || variants.length === 0}
                        >
                            {loading ? "..." : added ? "✓ ADDED" : isSoldOut ? "OUT OF STOCK" : "ADD"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}