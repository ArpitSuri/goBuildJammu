// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getProducts } from "../services/productService";
// import ProductCard from "./ProductCard";

// export default function CategoryPage() {
//     const { id } = useParams();
//     const [products, setProducts] = useState([]);

//     const fetchProducts = async () => {
//         try {
//             const { data } = await getProducts({ category: id });
//             setProducts(data.products);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     useEffect(() => {
//         if (id) fetchProducts();
//     }, [id]);

//     return (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

//             <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">
//                 Products
//             </h1>

//             {products.length === 0 ? (
//                 <p className="text-sm sm:text-base">No products found</p>
//             ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                     {products.map(p => (
//                         <ProductCard key={p._id} product={p} />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // Import Helmet
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";
import ProductCard from "./ProductCard";

export default function CategoryPage() {
    const { id } = useParams(); // 'id' is the MongoDB category _id
    const [products, setProducts] = useState([]);
    const [displayTitle, setDisplayTitle] = useState("Loading...");

    const categoryTitle = displayTitle !== "Loading..." ? displayTitle : "Products";
    const siteUrl = `https://www.digitalinfratech.in/category/${id}`;

    // Fetch category name directly from categories API
    const fetchCategoryName = async () => {
        try {
            const { data } = await getCategories();
            const allCats = data.categories || [];
            const found = allCats.find(c => c._id === id);
            if (found) {
                setDisplayTitle(found.name);
            }
        } catch (err) {
            console.error("Failed to fetch category name", err);
        }
    };

    const fetchProducts = async () => {
        try {
            const { data } = await getProducts({ category: id });
            setProducts(data.products);

            // If we still don't have a title, try to get it from products
            if (displayTitle === "Loading..." && data.products.length > 0) {
                setDisplayTitle(data.products[0].category.name);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (id) {
            fetchCategoryName();
            fetchProducts();
        }
    }, [id]);

    return (
        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 py-16 font-sans min-h-screen">
            <Helmet>
                {/* Dynamic Title and Description for Lucknow Market */}
                <title>{`${displayTitle} in Lucknow | Digital Infratech`}</title>
                <meta name="description" content={`Buy high-quality ${categoryTitle} online at Digital Infratech. We provide wholesale prices and doorstep delivery for all ${categoryTitle} across Lucknow.`} />
                <link rel="canonical" href={siteUrl} />

                {/* Open Graph Tags */}
                <meta property="og:title" content={`Premium ${categoryTitle} Supplies - Digital Infratech Lucknow`} />
                <meta property="og:description" content={`Explore our wide range of ${categoryTitle}. Competitive pricing and reliable delivery in Lucknow.`} />
                <meta property="og:url" content={siteUrl} />
                <meta property="og:type" content="website" />

                {/* CollectionPage Schema: Tells Google this is a list of products */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        "name": `${categoryTitle} for Construction in Lucknow`,
                        "description": `A curated list of ${categoryTitle} available for doorstep delivery at Digital Infratech.`,
                        "url": siteUrl,
                        "mainEntity": {
                            "@type": "ItemList",
                            "itemListElement": products.slice(0, 10).map((p, index) => ({
                                "@type": "ListItem",
                                "position": index + 1,
                                "url": `https://www.digitalinfratech.in/product/${p._id}`,
                                "name": p.name
                            }))
                        }
                    })}
                </script>
            </Helmet>

            <div className="mb-10 text-center md:text-left">
                <h1 className="text-2xl lg:text-3xl font-light text-black tracking-tight capitalize mb-2">
                    {displayTitle}
                </h1>
                <div className="h-[1px] w-12 bg-black mx-auto md:mx-0"></div>
            </div>

            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-[14px] font-light text-gray-500 uppercase tracking-widest">No products found</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                    {products.map(p => (
                        <ProductCard key={p._id} product={p} />
                    ))}
                </div>
            )}
        </div>
    );
}