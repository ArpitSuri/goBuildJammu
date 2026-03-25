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

    if (loading) return <div className="p-4">Loading deals...</div>;

    if (variants.length === 0) return null;

    return (
        <section className="px-4 py-6">
            <h2 className="text-xl font-bold mb-4">
                Best Deals Right Now
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {variants.map((variant) => (
                    <ProductCard
                        key={variant._id}
                        product={{
                            ...variant.product,
                            // 🔥 inject selected variant manually
                            preSelectedVariant: variant
                        }}
                    />
                ))}
            </div>
        </section>
    );
}