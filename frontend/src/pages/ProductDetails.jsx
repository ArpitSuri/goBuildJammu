import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProducts } from "../../services/productService";
import { getVariantsByProduct } from "../../services/variantService";
import { addToCart } from "../../services/cartService";


export default function ProductDetail() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetchProduct();
        fetchVariants();
    }, [id]);

    const fetchProduct = async () => {
        const { data } = await getProducts();
        const found = data.products.find(p => p._id === id);
        setProduct(found);
    };

    const fetchVariants = async () => {
        const { data } = await getVariantsByProduct(id);
        setVariants(data.variants);

        if (data.variants.length > 0) {
            setSelected(data.variants[0]);
        }
    };

    const handleAddToCart = async () => {
        if (!selected) return;

        try {
            await addToCart(selected._id, 1);
            alert("Added to cart");
        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };

    if (!product) return <p>Loading...</p>;

    return (
        <div className="max-w-6xl mx-auto p-6 grid grid-cols-2 gap-8">

            {/* LEFT - IMAGE */}
            <div className="bg-gray-100 h-[400px] flex items-center justify-center">
                IMG
            </div>

            {/* RIGHT - DETAILS */}
            <div>

                <h1 className="text-xl font-semibold mb-2">
                    {product.name}
                </h1>

                <p className="text-sm text-gray-500 mb-4">
                    {product.brand}
                </p>

                {/* PRICE */}
                {selected && (
                    <div className="mb-4">
                        <p className="text-2xl font-semibold">
                            ₹{selected.discountPrice || selected.price}
                        </p>

                        {selected.discountPrice && (
                            <p className="text-sm line-through text-gray-400">
                                ₹{selected.price}
                            </p>
                        )}
                    </div>
                )}

                {/* VARIANTS */}
                <div className="mb-6">
                    <p className="font-medium mb-2">Select Variant</p>

                    <div className="flex flex-wrap gap-2">
                        {variants.map(v => (
                            <button
                                key={v._id}
                                onClick={() => setSelected(v)}
                                className={`px-3 py-1 border rounded
                  ${selected?._id === v._id ? "bg-black text-white" : ""}`}
                            >
                                {v.attributes.map(a => a.value).join(" / ")}
                            </button>
                        ))}
                    </div>
                </div>

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-600 mb-6">
                    {product.description}
                </p>

                {/* ADD TO CART */}
                <button
                    onClick={handleAddToCart}
                    className="bg-black text-white px-6 py-2 rounded"
                >
                    Add to Cart
                </button>

            </div>
        </div>
    );
}