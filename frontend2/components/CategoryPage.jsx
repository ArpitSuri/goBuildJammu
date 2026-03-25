import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProducts } from "../services/productService";
import ProductCard from "./ProductCard";

export default function CategoryPage() {
    const { id } = useParams();
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const { data } = await getProducts({ category: id });
            setProducts(data.products);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (id) fetchProducts();
    }, [id]);

    return (
        <div className="max-w-7xl mx-auto p-6">

            <h1 className="text-xl font-semibold mb-4">
                Products
            </h1>

            {products.length === 0 ? (
                <p>No products found</p>
            ) : (
                    <div className="grid grid-cols-4 gap-4">
                        {products.map(p => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
            )}

        </div>
    );
}