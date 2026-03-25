import { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";
import { getCart } from "../services/cartService";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const [parentCats, setParentCats] = useState([]);
    const [childMap, setChildMap] = useState({});
    const [cartCount, setCartCount] = useState(0);

const [pincode, setPincode] = useState(localStorage.getItem("pincode") || "282001");
const [showModal, setShowModal] = useState(false);
const [inputPin, setInputPin] = useState("");
const [pinError, setPinError] = useState("");

const [showUserMenu, setShowUserMenu] = useState(false);

const navigate = useNavigate();

const SERVICEABLE_PINS = ["282001", "110001", "144001"];

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

        // ✅ Reverse each child array
        Object.keys(map).forEach(parentId => {
            map[parentId].reverse();
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

const handlePinSubmit = () => {
    if (!SERVICEABLE_PINS.includes(inputPin)) {
        setPinError("❌ Sorry, we don’t deliver to this location yet.");
        return;
    }

    localStorage.setItem("pincode", inputPin);
    setPincode(inputPin);
    setPinError("");
    setShowModal(false);
};

const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
};

const token = localStorage.getItem("token");

return (
    <nav className="bg-white border-b">

        {/* ---------- ROW 1 ---------- */}
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">

            <button
                onClick={() => setShowModal(true)}
                className="text-sm flex items-center gap-1"
            >
                Delivering to <span className="font-semibold">{pincode}</span>
                ▼
            </button>

            <Link to="/" className="font-bold text-lg">
                GoBuild
            </Link>

            <div className="flex items-center gap-4">

                <button onClick={() => navigate("/search")}>
                    🔍
                </button>

                <div className="relative">
                    <button onClick={() => setShowUserMenu(!showUserMenu)}>
                        👤
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 bg-white shadow-md border rounded w-40 z-50">

                            {!token ? (
                                <>
                                    <button
                                        onClick={() => navigate("/login")}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => navigate("/signup")}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Signup
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => navigate("/my-profile")}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        My Profile
                                    </button>
                                    <button
                                        onClick={() => navigate("/my-orders")}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        My Orders
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                                    >
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <button
                    onClick={() => navigate("/cart")}
                    className="relative"
                >
                    🛒
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs px-1 rounded-full">
                            {cartCount}
                        </span>
                    )}
                </button>

            </div>
        </div>

        {/* ---------- ROW 2 ---------- */}
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-6 text-sm border-t">

            <Link to="/" className="hover:underline">
                Home
            </Link>

            {parentCats.map(parent => (
                <div key={parent._id} className="relative group py-2">

                    <span className="cursor-pointer hover:underline">
                        {parent.name}
                    </span>

                    {childMap[parent._id] && (
                        <div className="absolute left-0 top-full min-w-[200px] hidden group-hover:block bg-white shadow-md border z-50">
                            {childMap[parent._id].map(child => (
                                <Link
                                    key={child._id}
                                    to={`/category/${ child._id } `}
                                    className="block px-4 py-2 hover:bg-gray-100"
                                >
                                    {child.name}
                                </Link>
                            ))}
                        </div>
                    )}

                </div>
            ))}

        </div>

        {/* ---------- PINCODE MODAL ---------- */}
        {showModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                <div className="bg-white p-6 rounded w-80">
                    <h2 className="font-semibold mb-3">Enter Pincode</h2>

                    <input
                        type="text"
                        value={inputPin}
                        onChange={(e) => setInputPin(e.target.value)}
                        className="border w-full px-3 py-2 mb-2"
                        placeholder="Enter pincode"
                    />

                    {pinError && (
                        <p className="text-red-500 text-sm mb-2">
                            {pinError}
                        </p>
                    )}

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setShowModal(false)}
                            className="px-3 py-1 border"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePinSubmit}
                            className="px-3 py-1 bg-black text-white"
                        >
                            Save
                        </button>
                    </div>
                </div>

            </div>
        )}

    </nav>
);

}
