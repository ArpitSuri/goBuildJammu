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
        <>
            <style>{`
                .hr-deals-skeleton {
                    max-width: 1400px; margin: 0 auto; padding: 32px 32px;
                    font-family: 'Inter', sans-serif;
                }
                .hr-deals-skel-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 16px;
                    margin-top: 20px;
                }
                .hr-skel-card {
                    background: #f5f5f5;
                    border-radius: 10px;
                    height: 320px;
                    animation: skelPulse 1.4s ease-in-out infinite;
                }
                @keyframes skelPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
            <div className="hr-deals-skeleton">
                <div style={{ width: 200, height: 28, background: "#f0f0f0", borderRadius: 6, marginBottom: 8 }} />
                <div style={{ width: 280, height: 18, background: "#f0f0f0", borderRadius: 6 }} />
                <div className="hr-deals-skel-grid">
                    {[...Array(5)].map((_, i) => <div key={i} className="hr-skel-card" />)}
                </div>
            </div>
        </>
    );

    if (variants.length === 0) return null;

    return (
        <>
            <style>{`
                .hr-deals-section {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 8px 32px 40px;
                    font-family: 'Inter', sans-serif;
                    border-top: 1px solid #f0f0f0;
                }
                .hr-deals-header {
                    margin-bottom: 6px;
                }
                .hr-deals-title {
                    font-size: 22px;
                    font-weight: 700;
                    color: #111;
                    margin: 0 0 4px;
                }
                .hr-deals-sub {
                    font-size: 13px;
                    color: #888;
                    margin: 0 0 20px;
                }
                .hr-deals-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 16px;
                }
                @media (max-width: 1100px) {
                    .hr-deals-grid { grid-template-columns: repeat(4, 1fr); }
                }
                @media (max-width: 860px) {
                    .hr-deals-grid { grid-template-columns: repeat(3, 1fr); }
                }
                @media (max-width: 600px) {
                    .hr-deals-section { padding: 24px 16px; }
                    .hr-deals-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
                }
            `}</style>

            <section className="hr-deals-section">
                <div className="hr-deals-header">
                    <h2 className="hr-deals-title">Deals of the Week</h2>
                    <p className="hr-deals-sub">{variants.length} products at our lowest ever price</p>
                </div>

                <div className="hr-deals-grid">
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
        </>
    );
}