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
import ProductCard from "./ProductCard";

export default function CategoryPage() {
    const { id } = useParams(); // 'id' usually represents the category name or slug
    const [products, setProducts] = useState([]);
    // Fallback title agar products load nahi hue
    const [displayTitle, setDisplayTitle] = useState("Loading...");

    // Format the category name for the UI (e.g., "building-materials" -> "Building Materials")
    const categoryTitle = id ? id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "Products";
    const siteUrl = `https://www.digitalinfratech.in/category/${id}`;
    

    const fetchProducts = async () => {
        try {
            const { data } = await getProducts({ category: id });
            setProducts(data.products);

            // Yahan se asli category name uthao
            if (data.products.length > 0) {
                setDisplayTitle(data.products[0].category.name);
            } else {
                // Agar products nahi mile toh URL slug ko format karlo
                setDisplayTitle(id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
            }
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        if (id) fetchProducts();
    }, [id]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
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

            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 capitalize">
                {displayTitle}
            </h1>

            {products.length === 0 ? (
                <p className="text-sm sm:text-base">No products found</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map(p => (
                        <ProductCard key={p._id} product={p} />
                    ))}
                </div>
            )}
        </div>
    );
}