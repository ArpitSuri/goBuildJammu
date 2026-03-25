import { useEffect, useState } from "react";
import { getVariantsByProduct } from "../services/variantService";

export default function QuickViewModal({ product, onClose }) {
    const [variants, setVariants] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVariants();
    }, []);

    const fetchVariants = async () => {
        try {
            setLoading(true);

            const { data } = await getVariantsByProduct(product._id);

            setVariants(data.variants);

            if (data.variants.length > 0) {
                setSelected(data.variants[0]);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white w-[520px] p-6 rounded-xl">

                {/* TITLE */}
                <h2 className="font-semibold text-lg mb-2">
                    {product.name}
                </h2>

                <p className="text-sm text-gray-500 mb-4">
                    {product.brand}
                </p>

                {/* LOADING */}
                {loading ? (
                    <p>Loading variants...</p>
                ) : variants.length === 0 ? (
                    <p>No variants available</p>
                ) : (
                    <>
                        {/* VARIANT OPTIONS */}
                        <div className="mb-4">
                            <p className="text-sm mb-2 font-medium">
                                Select Variant
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {variants.map(v => (
                                    <button
                                        key={v._id}
                                        onClick={() => setSelected(v)}
                                        className={`px-3 py-1 border rounded text-sm
                      ${selected?._id === v._id
                                                ? "bg-black text-white"
                                                : "bg-white"
                                            }`}
                                    >
                                        {v.attributes
                                            .map(a => a.value)
                                            .join(" / ")}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* PRICE */}
                        {selected && (
                            <div className="mb-4">
                                <p className="text-lg font-semibold">
                                    ₹{selected.discountPrice || selected.price}
                                </p>

                                {selected.discountPrice && (
                                    <p className="text-sm text-gray-400 line-through">
                                        ₹{selected.price}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* STOCK */}
                        {selected && (
                            <p className="text-sm text-gray-500 mb-4">
                                Stock: {selected.stock}
                            </p>
                        )}

                        {/* ACTION */}
                        <button className="bg-black text-white w-full py-2 rounded">
                            Add to Cart
                        </button>
                    </>
                )}

                {/* CLOSE */}
                <button
                    onClick={onClose}
                    className="mt-4 text-sm text-gray-500"
                >
                    Close
                </button>

            </div>
        </div>
    );
}