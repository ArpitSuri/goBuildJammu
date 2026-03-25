import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/product/${product._id}`)}
            className="border rounded-xl p-3 hover:shadow cursor-pointer"
        >
            <div className="h-40 bg-gray-100 flex items-center justify-center mb-2">
                IMG
            </div>

            <h3 className="text-sm font-medium">{product.name}</h3>
            <p className="text-xs text-gray-500">{product.brand}</p>

            <p className="mt-1 font-semibold">
                {product.minPrice
                    ? `Starting from ₹${product.minPrice}`
                    : "No variants"}
            </p>
        </div>
    );
}