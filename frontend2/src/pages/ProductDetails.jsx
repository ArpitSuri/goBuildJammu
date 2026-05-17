import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProducts } from "../../services/productService";
import { getVariantsByProduct } from "../../services/variantService";
import { addToCart } from "../../services/cartService";
import { Helmet } from "react-helmet-async";

export default function ProductDetail() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);

    // NEW: State for the currently displayed main image
    const [mainImage, setMainImage] = useState(null);

    useEffect(() => {
        fetchProduct();
        fetchVariants();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data } = await getProducts();
            const found = data.products.find(p => p._id === id);
            setProduct(found);

            // NEW: Set the initial main image to the first available image
            if (found && found.images && found.images.length > 0) {
                setMainImage(found.images[0].url);
            }
        } catch (err) {
            console.error("Error fetching product", err);
        }
    };

    const fetchVariants = async () => {
        try {
            const { data } = await getVariantsByProduct(id);
            setVariants(data.variants);
            if (data.variants.length > 0) {
                setSelected(data.variants[0]);
            }
        } catch (err) {
            console.error("Error fetching variants", err);
        }
    };

    const handleAddToCart = async () => {
        if (!selected || selected.stock <= 0) return;

        try {
            setLoading(true);
            await addToCart(selected._id, 1);
            alert("Added to cart");
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (err) {
            alert(err.response?.data?.message || "Error adding to cart");
        } finally {
            setLoading(false);
        }
    };

    if (!product) return <div className="p-10 text-center text-gray-600">Loading product details...</div>;

    // Logic for availability
    const currentPrice = selected ? (selected.discountPrice || selected.price) : 0;
    const isOutOfStock = selected ? selected.stock <= 0 : true;
    const siteUrl = `https://www.digitalinfratech.in/product/${id}`;

    return (
        <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Helmet>
                <title>{`${product.name} | Buy Online in Lucknow - Digital Infratech`}</title>
                <meta name="description" content={`Get the best price on ${product.name}...`} />

                {/* Ab currentPrice define ho gaya hai, toh niche waali lines error nahi dengi */}
                <meta property="product:price:amount" content={currentPrice} />
                <meta property="product:price:currency" content="INR" />

                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org/",
                        "@type": "Product",
                        "name": product.name,
                        "offers": {
                            "@type": "Offer",
                            "price": currentPrice, // Fix applied here too
                            "priceCurrency": "INR",
                            "availability": isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
                            // ... baaki schema ...
                        }
                    })}
                </script>
            </Helmet>

            {/* LEFT - IMAGE GALLERY SECTION */}
            <div className="flex flex-col gap-4">

                {/* BIG MAIN IMAGE */}
                <div className="bg-white border border-gray-100 rounded-3xl h-[450px] flex items-center justify-center relative p-6 group overflow-hidden">
                    {mainImage ? (
                        <img
                            src={mainImage}
                            alt={`${product.name} large view`}
                            className={`max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105 ${isOutOfStock ? 'grayscale opacity-70' : ''}`}
                        />
                    ) : (
                        <div className="text-[12px] font-medium tracking-widest uppercase text-gray-300">No Image</div>
                    )}

                    {isOutOfStock && (
                        <div className="absolute top-5 right-5 bg-black text-white px-4 py-1.5 text-[10px] font-medium tracking-widest uppercase rounded-full">
                            SOLD OUT
                        </div>
                    )}
                </div>

                {/* SMALL THUMBNAILS - Fixed with map logic */}
                {product.images && product.images.length > 1 && (
                    <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-5 gap-3 pt-2">
                        {product.images.map((img, index) => (
                            <button
                                key={img.public_id || index}
                                onClick={() => setMainImage(img.url)}
                                className={`group bg-white border rounded-2xl h-20 flex items-center justify-center p-1.5 transition-all duration-200 aspect-square overflow-hidden
                                    ${mainImage === img.url
                                        ? "border-black"
                                        : "border-gray-100 hover:border-gray-300"}`}
                            >
                                <img
                                    src={img.url}
                                    alt={`${product.name} thumbnail ${index + 1}`}
                                    className={`max-h-full max-w-full object-contain mix-blend-multiply transition-all 
                                        ${mainImage === img.url ? '' : 'group-hover:opacity-80'}`}
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* RIGHT - DETAILS SECTION */}
            <div className="lg:pl-8 font-sans">
                <div className="mb-8 border-b border-gray-100 pb-6">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mb-2">
                        {product.brand}
                    </p>
                    <h1 className="text-3xl font-light text-black tracking-tight leading-tight mb-4">
                        {product.name}
                    </h1>
                    <div className="flex gap-2 items-center">
                        {product.tags?.map(tag => (
                            <span key={tag} className="text-[10px] uppercase tracking-widest border border-gray-200 text-gray-500 px-3 py-1 font-medium rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* PRICE SECTION */}
                {selected && (
                    <div className="mb-8 bg-gray-50 p-6 border border-gray-100 rounded-3xl">
                        <div className="flex items-baseline gap-4">
                            <span className="text-3xl font-bold text-black">
                                ₹{(selected.discountPrice || selected.price).toLocaleString()}
                            </span>
                            {selected.discountPrice && (
                                <span className="text-lg line-through text-gray-400 font-semibold">
                                    ₹{selected.price.toLocaleString()}
                                </span>
                            )}
                        </div>
                        {selected.discountPrice && (
                            <p className="text-[11px] uppercase tracking-widest text-green-700 font-medium mt-2">
                                You save ₹{(selected.price - selected.discountPrice).toLocaleString()}
                            </p>
                        )}
                        {selected.stock > 0 && selected.stock < 5 && (
                            <p className="text-red-600 text-[11px] uppercase tracking-widest font-medium mt-4 p-3 bg-red-50 border border-red-100 inline-block rounded-xl">
                                Low Stock: Only {selected.stock} left in warehouse
                            </p>
                        )}
                    </div>
                )}
                {/* TECHNICAL ATTRIBUTES SECTION */}
                {selected && selected.attributes?.length > 0 && (
                    <div className="mb-8 border-t border-gray-100 pt-6">
                        <p className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                            Technical Specifications
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                            {selected.attributes.map((attrObj) => (
                                <div
                                    key={attrObj._id}
                                    className="flex justify-between items-center py-2 border-b border-gray-50 group hover:bg-gray-50 px-2 rounded-lg transition-colors"
                                >
                                    <span className="text-gray-500 text-sm font-medium">
                                        {attrObj.attribute?.name || "Attribute"}
                                    </span>
                                    <span className="text-gray-900 text-sm font-bold bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">
                                        {attrObj.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* VARIANTS SELECTOR */}
                <div className="mb-10">
                    <p className="text-[12px] font-medium tracking-widest uppercase text-black mb-4">Pack Size</p>
                    <div className="flex flex-wrap gap-3">
                        {variants.map(v => (
                            <button
                                key={v._id}
                                onClick={() => setSelected(v)}
                                className={`px-5 py-3 border transition-colors text-[12px] tracking-wide font-medium rounded-full
                        ${selected?._id === v._id
                                        ? "bg-black border-black text-white"
                                        : "bg-white border-gray-200 hover:border-black text-gray-600"}
                        ${v.stock <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {v.attributes?.length > 0
                                    ? v.attributes.map(a => a.value).join(" / ")
                                    : (v.sku || product.unit || "Bag")}
                                {v.stock <= 0 && " (Sold Out)"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* DESCRIPTION */}
                <div className="mb-10">
                    <p className="font-semibold text-gray-900 mb-3">About This Product</p>
                    <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                        {product.description}
                    </p>
                </div>

                {/* ACTION BUTTON */}
                <div className="sticky bottom-4 bg-white/90 backdrop-blur-sm p-4 -mx-4 border-t border-gray-100 lg:relative lg:bottom-0 lg:p-0 lg:border-none lg:bg-transparent">
                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock || loading}
                        className={`w-full lg:w-auto px-12 py-4 text-[12px] font-medium tracking-widest uppercase transition-all duration-300 border rounded-full
                ${isOutOfStock
                                ? "bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed"
                                : "bg-black text-white border-black hover:bg-gray-900 shadow-lg shadow-black/10 hover:shadow-none"}`}
                    >
                        {loading ? "PROCESSING..." : isOutOfStock ? "SOLD OUT" : "ADD TO CART"}
                    </button>
                </div>
            </div>
        </div>
    );
}