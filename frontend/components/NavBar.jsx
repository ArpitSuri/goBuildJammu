import { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";
import { getCart } from "../services/cartService";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const [parentCats, setParentCats] = useState([]);
    const [childMap, setChildMap] = useState({});
    const [cartCount, setCartCount] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
        fetchCartCount();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await getCategories();
            const all = data.categories;

            const parents = all.filter(c => c.level === 0);
            setParentCats(parents);

            const map = {};
            all.forEach(c => {
                if (c.parent) {
                    const parentId = c.parent._id;
                    if (!map[parentId]) map[parentId] = [];
                    map[parentId].push(c);
                }
            });

            setChildMap(map);

        } catch (err) {
            console.error(err);
        }
    };

    const fetchCartCount = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const { data } = await getCart();

            const totalItems = data?.items?.reduce(
                (sum, item) => sum + item.quantity,
                0
            );

            setCartCount(totalItems || 0);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <nav className="bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

                {/* LEFT SIDE */}
                <div className="flex items-center gap-8">

                    <Link to="/" className="font-semibold text-gray-800">
                        Home
                    </Link>

                    {parentCats.map(parent => (
                        <div key={parent._id} className="relative group">

                            <span className="cursor-pointer text-gray-700 hover:text-black">
                                {parent.name}
                            </span>

                            {childMap[parent._id] && (
                                <div className="absolute top-full left-0 bg-white shadow-lg border rounded-md hidden group-hover:block min-w-[200px] z-50">

                                    {childMap[parent._id].map(child => (
                                        <Link
                                            key={child._id}
                                            to={`/category/${child._id}`}
                                            className="block px-4 py-2 text-sm hover:bg-gray-100"
                                        >
                                            {child.name}
                                        </Link>
                                    ))}

                                </div>
                            )}

                        </div>
                    ))}

                </div>

                {/* RIGHT SIDE (CART) */}
                <div className="flex items-center gap-4">

                    <button
                        onClick={() => navigate("/cart")}
                        className="relative"
                    >
                        {/* Cart Icon (SVG) */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-gray-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7h13M7 13L5.4 5M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
                            />
                        </svg>

                        {/* Count Badge */}
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 py-[2px] rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </button>

                </div>

            </div>
        </nav>
    );
}