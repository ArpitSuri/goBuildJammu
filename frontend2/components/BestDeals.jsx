// import { useEffect, useState } from "react";
// import { getDiscountedVariant } from "../services/variantService";
// import ProductCard from "./ProductCard";

// export default function BestDeals() {
//     const [variants, setVariants] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetchDeals();
//     }, []);

//     const fetchDeals = async () => {
//         try {
//             const { data } = await getDiscountedVariant();
//             setVariants(data.variants || []);
//         } catch (err) {
//             console.error("Failed to fetch deals", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) return <div className="p-4">Loading deals...</div>;

//     if (variants.length === 0) return null;

//     return (
//         <section className="px-4 py-6">
//             <h2 className="text-xl font-bold mb-4">
//                 Best Deals Right Now
//             </h2>

//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//                 {variants.map((variant) => (
//                     <ProductCard
//                         key={variant._id}
//                         product={{
//                             ...variant.product,
//                             // 🔥 inject selected variant manually
//                             preSelectedVariant: variant
//                         }}
//                     />
//                 ))}
//             </div>
//         </section>
//     );
// }

import { useEffect, useState } from "react";
import { getDiscountedVariant } from "../services/variantService";
import ProductCard from "./ProductCard";

export default function BestDeals() {
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        try {
            const { data } = await getDiscountedVariant();
            setVariants(data.variants || []);
        } catch (err) {
            console.error("Failed to fetch deals", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 py-16 font-sans">
            <div className="h-8 w-64 bg-gray-100 mb-2 rounded animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-50 mb-10 rounded animate-pulse"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-80 bg-gray-50/50 border border-gray-100 animate-pulse"></div>
                ))}
            </div>
        </div>
    );

    if (variants.length === 0) return null;

    return (
        <section className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 py-16 font-sans border-t border-gray-100">
            <div className="mb-10 text-center md:text-left">
                <h2 className="text-2xl lg:text-3xl font-light text-black tracking-tight mb-2">Deals of the Week</h2>
                <p className="text-[14px] text-gray-500 font-light mb-4">{variants.length} products at our lowest ever price</p>
                <div className="h-[1px] w-12 bg-black mx-auto md:mx-0"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                {variants.map((variant) => (
                    <ProductCard
                        key={variant._id}
                        product={{
                            ...variant.product,
                            preSelectedVariant: variant
                        }}
                    />
                ))}
            </div>
        </section>
    );
}