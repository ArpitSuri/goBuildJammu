// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';

// const SearchPage = () => {
//     const [query, setQuery] = useState("");
//     const [results, setResults] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const delayDebounceFn = setTimeout(() => {
//             if (query.trim().length > 2) fetchResults();
//             else setResults([]);
//         }, 400);
//         return () => clearTimeout(delayDebounceFn);
//     }, [query]);

//     // const fetchResults = async () => {
//     //     setLoading(true);
//     //     try {
//     //         const res = await axios.get(`http://localhost:5000/api/products/search?q=${query}`);
//     //         setResults(res.data);
//     //     } catch (err) {
//     //         console.error(err);
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };
//     const fetchResults = async () => {
//         setLoading(true);
//         try {
//             const res = await axios.get(`http://localhost:5000/api/products/search?q=${query}`);

//             // ── THE FIX ──
//             // Ensure res.data is actually an array before setting state
//             if (Array.isArray(res.data)) {
//                 setResults(res.data);
//             } else {
//                 // If backend sends an object, wrap it or set empty
//                 setResults([]);
//             }
//         } catch (err) {
//             console.error("Search Error:", err);
//             setResults([]); // Reset to empty array on error
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* ── Search Header ── */}
//             <div className="sticky top-0 z-50 bg-white border-b border-gray-200 p-4 shadow-sm">
//                 <div className="max-w-7xl mx-auto flex items-center gap-3">
//                     <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
//                         <span className="text-xl">←</span>
//                     </button>
//                     <div className="flex-1 relative">
//                         <input
//                             autoFocus
//                             type="text"
//                             placeholder="Search construction tools, cement..."
//                             className="w-full bg-gray-100 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-yellow-500 outline-none text-base font-medium"
//                             value={query}
//                             onChange={(e) => setQuery(e.target.value)}
//                         />
//                         {loading && (
//                             <div className="absolute right-4 top-4 animate-spin h-5 w-5 border-2 border-yellow-500 border-t-transparent rounded-full" />
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* ── Results Grid ── */}
//             <div className="max-w-7xl mx-auto p-4 sm:p-6">
//                 {results.length > 0 ? (
//                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//                         {results.map((product) => (
//                             <SearchProductCard key={product._id} product={product} />
//                         ))}
//                     </div>
//                 ) : query.length > 2 && !loading ? (
//                     <div className="text-center py-20">
//                         <p className="text-gray-400 text-lg">No items found for "{query}"</p>
//                     </div>
//                 ) : (
//                     <div className="text-center py-20 text-gray-300">
//                         <p>Type at least 3 characters to search</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// /* ── The Tailwinds-version of your ProductCard ── */
// const SearchProductCard = ({ product }) => {
//     const navigate = useNavigate();
//     // Logic assumptions based on your snippet
//     const variants = product.variants || [];
//     const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);
//     const [quantity, setQuantity] = useState(1);
//     const [added, setAdded] = useState(false);

//     const isSoldOut = selectedVariant ? selectedVariant.stock <= 0 : true;
//     const actualPrice = selectedVariant?.price;
//     const originalPrice = selectedVariant?.mrp;
//     const discountPercent = originalPrice > actualPrice
//         ? Math.round(((originalPrice - actualPrice) / originalPrice) * 100)
//         : 0;

//     const handleAddToCart = (e) => {
//         e.stopPropagation();
//         setAdded(true);
//         setTimeout(() => setAdded(false), 2000);
//         // Add your actual dispatch/cart logic here
//     };

//     return (
//         <div
//             className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
//             onClick={() => navigate(`/product/${product._id}`)}
//         >
//             {/* Image Wrap */}
//             <div className="relative aspect-square bg-gray-50 overflow-hidden">
//                 {discountPercent > 0 && !isSoldOut && (
//                     <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
//                         {discountPercent}% OFF
//                     </div>
//                 )}

//                 {isSoldOut && (
//                     <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
//                         <span className="bg-white text-black text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">SOLD OUT</span>
//                     </div>
//                 )}

//                 {product.images?.[0] ? (
//                     <img
//                         src={product.images[0].url}
//                         alt={product.name}
//                         className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isSoldOut ? 'grayscale' : ''}`}
//                     />
//                 ) : (
//                     <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs font-bold">NO IMAGE</div>
//                 )}
//             </div>

//             {/* Body */}
//             <div className="p-3 flex flex-col flex-1">
//                 <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-1 min-h-[40px]">
//                     {product.name}
//                 </h3>

//                 <div className="flex items-baseline gap-2 mb-3">
//                     <span className="text-base font-black text-gray-900 italic">
//                         Rs. {actualPrice?.toLocaleString()}
//                     </span>
//                     {originalPrice > actualPrice && (
//                         <span className="text-xs text-gray-400 line-through">
//                             Rs. {originalPrice?.toLocaleString()}
//                         </span>
//                     )}
//                 </div>

//                 {/* Variant Select */}
//                 {variants.length > 1 && (
//                     <div className="mb-3" onClick={e => e.stopPropagation()}>
//                         <select
//                             className="w-full bg-gray-50 border border-gray-100 rounded-lg text-[11px] font-bold py-1.5 px-2 outline-none"
//                             value={selectedVariant?._id}
//                             onChange={e => setSelectedVariant(variants.find(v => v._id === e.target.value))}
//                         >
//                             {variants.map(v => (
//                                 <option key={v._id} value={v._id}>
//                                     {v.attributes?.map(a => a.value).join(" / ")} {v.stock <= 0 ? "(Out of Stock)" : ""}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 )}

//                 {/* Actions Row */}
//                 <div className="mt-auto flex items-center gap-2" onClick={e => e.stopPropagation()}>
//                     <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
//                         <button
//                             className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30"
//                             disabled={quantity <= 1 || isSoldOut}
//                             onClick={() => setQuantity(q => q - 1)}
//                         >−</button>
//                         <span className="w-6 text-center text-xs font-bold">{quantity}</span>
//                         <button
//                             className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30"
//                             disabled={isSoldOut}
//                             onClick={() => setQuantity(q => q + 1)}
//                         >+</button>
//                     </div>

//                     <button
//                         className={`flex-1 py-2 rounded-xl text-[11px] font-black tracking-tighter transition-all duration-300 ${isSoldOut
//                                 ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                                 : added
//                                     ? 'bg-green-500 text-white'
//                                     : 'bg-yellow-400 text-black hover:bg-yellow-500'
//                             }`}
//                         onClick={handleAddToCart}
//                         disabled={isSoldOut}
//                     >
//                         {isSoldOut ? "OUT" : added ? "✓ ADDED" : "ADD TO CART"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default SearchPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard'; // Adjust this path to your actual file

const SearchPage = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim().length > 2) {
                fetchResults();
            } else {
                setResults([]);
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/products/search?q=${query}`);
            // Check if res.data is an array to prevent .map crash
            if (Array.isArray(res.data)) {
                setResults(res.data);
            } else {
                setResults([]);
            }
        } catch (err) {
            console.error("Search Error:", err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ── Search Header ── */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200 p-4 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <span className="text-xl">←</span>
                    </button>
                    <div className="flex-1 relative">
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search products..."
                            className="w-full bg-gray-100 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-green-500 outline-none text-base font-medium"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {loading && (
                            <div className="absolute right-4 top-4 animate-spin h-5 w-5 border-2 border-green-500 border-t-transparent rounded-full" />
                        )}
                    </div>
                </div>
            </div>

            {/* ── Results Grid ── */}
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                {results.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {results.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : query.length > 2 && !loading ? (
                    <div className="text-center py-20 text-gray-500 font-medium">
                        No items found for "{query}"
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400">
                        Type at least 3 characters to start searching
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;