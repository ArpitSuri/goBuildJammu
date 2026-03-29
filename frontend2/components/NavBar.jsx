// import { useEffect, useState } from "react";
// import { getCategories } from "../services/categoryService";
// import { getCart } from "../services/cartService";
// import { Link, useNavigate } from "react-router-dom";

// export default function Navbar() {
//     const [parentCats, setParentCats] = useState([]);
//     const [childMap, setChildMap] = useState({});
//     const [cartCount, setCartCount] = useState(0);

// const [pincode, setPincode] = useState(localStorage.getItem("pincode") || "282001");
// const [showModal, setShowModal] = useState(false);
// const [inputPin, setInputPin] = useState("");
// const [pinError, setPinError] = useState("");

// const [showUserMenu, setShowUserMenu] = useState(false);

// const navigate = useNavigate();

// const SERVICEABLE_PINS = ["282001", "110001", "144001"];

// useEffect(() => {
//     fetchCategories();
//     fetchCartCount();
// }, []);

// const fetchCategories = async () => {
//     try {
//         const { data } = await getCategories();
//         const all = data.categories;

//         const parents = all.filter(c => c.level === 0);
//         setParentCats(parents);

//         const map = {};
//         all.forEach(c => {
//             if (c.parent) {
//                 const parentId = c.parent._id;
//                 if (!map[parentId]) map[parentId] = [];
//                 map[parentId].push(c);
//             }
//         });

//         // ✅ Reverse each child array
//         Object.keys(map).forEach(parentId => {
//             map[parentId].reverse();
//         });

//         setChildMap(map);
//     } catch (err) {
//         console.error(err);
//     }
// };

// const fetchCartCount = async () => {
//     try {
//         const token = localStorage.getItem("token");
//         if (!token) return;

//         const { data } = await getCart();

//         const totalItems = data?.items?.reduce(
//             (sum, item) => sum + item.quantity,
//             0
//         );

//         setCartCount(totalItems || 0);
//     } catch (err) {
//         console.error(err);
//     }
// };

// const handlePinSubmit = () => {
//     if (!SERVICEABLE_PINS.includes(inputPin)) {
//         setPinError("❌ Sorry, we don’t deliver to this location yet.");
//         return;
//     }

//     localStorage.setItem("pincode", inputPin);
//     setPincode(inputPin);
//     setPinError("");
//     setShowModal(false);
// };

// const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//     window.location.reload();
// };

// const token = localStorage.getItem("token");

// return (
//     <nav className="bg-white border-b">

//         {/* ---------- ROW 1 ---------- */}
//         <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">

//             <button
//                 onClick={() => setShowModal(true)}
//                 className="text-sm flex items-center gap-1"
//             >
//                 Delivering to <span className="font-semibold">{pincode}</span>
//                 ▼
//             </button>

//             <Link to="/" className="font-bold text-lg">
//                 GoBuild
//             </Link>

//             <div className="flex items-center gap-4">

//                 <button onClick={() => navigate("/search")}>
//                     🔍
//                 </button>

//                 <div className="relative">
//                     <button onClick={() => setShowUserMenu(!showUserMenu)}>
//                         👤
//                     </button>

//                     {showUserMenu && (
//                         <div className="absolute right-0 mt-2 bg-white shadow-md border rounded w-40 z-50">

//                             {!token ? (
//                                 <>
//                                     <button
//                                         onClick={() => navigate("/login")}
//                                         className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                                     >
//                                         Login
//                                     </button>
//                                     <button
//                                         onClick={() => navigate("/signup")}
//                                         className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                                     >
//                                         Signup
//                                     </button>
//                                 </>
//                             ) : (
//                                 <>
//                                     <button
//                                         onClick={() => navigate("/my-profile")}
//                                         className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                                     >
//                                         My Profile
//                                     </button>
//                                     <button
//                                         onClick={() => navigate("/my-orders")}
//                                         className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                                     >
//                                         My Orders
//                                     </button>
//                                     <button
//                                         onClick={handleLogout}
//                                         className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
//                                     >
//                                         Logout
//                                     </button>
//                                 </>
//                             )}
//                         </div>
//                     )}
//                 </div>

//                 <button
//                     onClick={() => navigate("/cart")}
//                     className="relative"
//                 >
//                     🛒
//                     {cartCount > 0 && (
//                         <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs px-1 rounded-full">
//                             {cartCount}
//                         </span>
//                     )}
//                 </button>

//             </div>
//         </div>

//         {/* ---------- ROW 2 ---------- */}
//         <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-6 text-sm border-t">

//             <Link to="/" className="hover:underline">
//                 Home
//             </Link>

//             {parentCats.map(parent => (
//                 <div key={parent._id} className="relative group py-2">

//                     <span className="cursor-pointer hover:underline">
//                         {parent.name}
//                     </span>

//                     {childMap[parent._id] && (
//                         <div className="absolute left-0 top-full min-w-[200px] hidden group-hover:block bg-white shadow-md border z-50">
//                             {childMap[parent._id].map(child => (
//                                 <Link
//                                     key={child._id}
//                                     to={`/category/${ child._id } `}
//                                     className="block px-4 py-2 hover:bg-gray-100"
//                                 >
//                                     {child.name}
//                                 </Link>
//                             ))}
//                         </div>
//                     )}

//                 </div>
//             ))}

//         </div>

//         {/* ---------- PINCODE MODAL ---------- */}
//         {showModal && (
//             <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

//                 <div className="bg-white p-6 rounded w-80">
//                     <h2 className="font-semibold mb-3">Enter Pincode</h2>

//                     <input
//                         type="text"
//                         value={inputPin}
//                         onChange={(e) => setInputPin(e.target.value)}
//                         className="border w-full px-3 py-2 mb-2"
//                         placeholder="Enter pincode"
//                     />

//                     {pinError && (
//                         <p className="text-red-500 text-sm mb-2">
//                             {pinError}
//                         </p>
//                     )}

//                     <div className="flex justify-end gap-2">
//                         <button
//                             onClick={() => setShowModal(false)}
//                             className="px-3 py-1 border"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             onClick={handlePinSubmit}
//                             className="px-3 py-1 bg-black text-white"
//                         >
//                             Save
//                         </button>
//                     </div>
//                 </div>

//             </div>
//         )}

//     </nav>
// );

// }


import { useEffect, useState, useRef } from "react";
import { getCategories } from "../services/categoryService";
import { getCart } from "../services/cartService";
import { Link, useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────
//  Icons (inline SVG – no extra deps needed)
// ─────────────────────────────────────────────
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);
const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);
const ChevronDown = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);
const LocationPin = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
);

// ─────────────────────────────────────────────
//  Announcement Bar (marquee style)
// ─────────────────────────────────────────────
const ANNOUNCEMENTS = [
    "🚀 Superfast delivery in Jammu!",
    "🏗️ 100% Genuine Construction Materials",
    "🆓 Free delivery on orders above ₹5,000",
    "📞 Open 8am to 8pm · All Days",
];

function AnnouncementBar() {
    const [idx, setIdx] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setIdx(i => (i + 1) % ANNOUNCEMENTS.length);
                setFade(true);
            }, 400);
        }, 3500);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{
            background: "#FFD700",
            padding: "8px 16px",
            textAlign: "center",
            fontSize: "13px",
            fontWeight: "600",
            letterSpacing: "0.3px",
            color: "#111",
            position: "relative",
            overflow: "hidden",
        }}>
            <span style={{
                display: "inline-block",
                transition: "opacity 0.4s ease",
                opacity: fade ? 1 : 0,
            }}>
                {ANNOUNCEMENTS[idx]}
            </span>
        </div>
    );
}

// ─────────────────────────────────────────────
//  Main Navbar Component
// ─────────────────────────────────────────────
export default function Navbar() {
    const [parentCats, setParentCats] = useState([]);
    const [childMap, setChildMap] = useState({});
    const [cartCount, setCartCount] = useState(0);
    const [pincode, setPincode] = useState(localStorage.getItem("pincode") || "180001");
    const [showModal, setShowModal] = useState(false);
    const [inputPin, setInputPin] = useState("");
    const [pinError, setPinError] = useState("");
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [openCat, setOpenCat] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const userMenuRef = useRef(null);
    const navigate = useNavigate();

    const SERVICEABLE_PINS = ["180001", "180002", "180003", "180004", "180005", "180006", "180007", "180011", "180012", "180013", "180015", "180016", "180017", "180019", "180020", "282001", "110001", "144001"];

    useEffect(() => {
        fetchCategories();
        fetchCartCount();
    }, []);

    // Close user menu on outside click
    useEffect(() => {
        const handler = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
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
                    const pid = c.parent._id;
                    if (!map[pid]) map[pid] = [];
                    map[pid].push(c);
                }
            });
            Object.keys(map).forEach(pid => map[pid].reverse());
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
            const total = data?.items?.reduce((sum, item) => sum + item.quantity, 0);
            setCartCount(total || 0);
        } catch (err) {
            console.error(err);
        }
    };

    const handlePinSubmit = () => {
        if (!SERVICEABLE_PINS.includes(inputPin)) {
            setPinError("❌ Sorry, we don't deliver to this location yet.");
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
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .gb-nav {
          font-family: 'Inter', sans-serif;
          background: #fff;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 1px 6px rgba(0,0,0,0.08);
        }

        /* ── Middle row ── */
        .gb-nav-mid {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 32px;
          border-bottom: 1px solid #f0f0f0;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }

        /* Delivery badge */
        .gb-delivery-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        .gb-mins-box {
          background: #22c55e;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          border-radius: 6px;
          padding: 4px 6px;
          line-height: 1.2;
          text-align: center;
          min-width: 36px;
        }
        .gb-mins-box span { display: block; font-size: 16px; font-weight: 800; }
        .gb-deliver-text { text-align: left; }
        .gb-deliver-text small { display: block; font-size: 10px; color: #888; font-weight: 500; }
        .gb-deliver-text strong { display: flex; align-items: center; gap: 3px; font-size: 13px; color: #111; }

        /* Logo */
        .gb-logo {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-size: 22px;
          font-weight: 800;
          color: #111;
          text-decoration: none;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .gb-logo-icon {
          background: #FFD700;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        /* Right icons */
        .gb-icon-group {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .gb-icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #111;
          display: flex;
          align-items: center;
          transition: color 0.2s;
          padding: 4px;
          position: relative;
        }
        .gb-icon-btn:hover { color: #f59e0b; }
        .gb-cart-badge {
          position: absolute;
          top: -6px;
          right: -8px;
          background: #FFD700;
          color: #111;
          font-size: 10px;
          font-weight: 700;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Bottom nav row ── */
        .gb-nav-bottom {
          border-top: 1px solid #f0f0f0;
        }
        .gb-nav-bottom-inner {
          display: flex;
          align-items: center;
          gap: 0;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 32px;
          box-sizing: border-box;
        }

        .gb-nav-item {
          position: relative;
        }
        .gb-nav-link {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 13px 14px;
          font-size: 14px;
          font-weight: 500;
          color: #222;
          text-decoration: none;
          cursor: pointer;
          white-space: nowrap;
          border-bottom: 3px solid transparent;
          transition: border-color 0.2s, color 0.2s;
          background: none;
          border-left: none;
          border-right: none;
          border-top: none;
        }
        .gb-nav-link:hover, .gb-nav-item:hover .gb-nav-link {
          color: #000;
          border-bottom-color: #FFD700;
        }

        /* Dropdown */
        .gb-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          min-width: 220px;
          background: #fff;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          border-top: 3px solid #FFD700;
          border-radius: 0 0 8px 8px;
          opacity: 0;
          pointer-events: none;
          transform: translateY(-6px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          z-index: 999;
        }
        .gb-nav-item:hover .gb-dropdown {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }
        .gb-dropdown a {
          display: block;
          padding: 11px 18px;
          font-size: 13.5px;
          color: #333;
          text-decoration: none;
          font-weight: 400;
          border-bottom: 1px solid #f5f5f5;
          transition: background 0.15s, padding-left 0.15s;
        }
        .gb-dropdown a:last-child { border-bottom: none; border-radius: 0 0 8px 8px; }
        .gb-dropdown a:hover {
          background: #fffbeb;
          padding-left: 24px;
          color: #000;
          font-weight: 500;
        }

        /* User popup */
        .gb-user-popup {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          min-width: 170px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          overflow: hidden;
          z-index: 9999;
          animation: popIn 0.15s ease;
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95) translateY(-4px); }
          to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
        .gb-user-popup button {
          display: block;
          width: 100%;
          text-align: left;
          padding: 11px 16px;
          font-size: 13.5px;
          color: #333;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          transition: background 0.15s;
        }
        .gb-user-popup button:hover { background: #f9f9f9; }
        .gb-user-popup button.danger { color: #ef4444; }
        .gb-user-popup hr { margin: 4px 0; border: none; border-top: 1px solid #f0f0f0; }

        /* Pincode Modal */
        .gb-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeBg 0.2s ease;
        }
        @keyframes fadeBg { from { opacity: 0; } to { opacity: 1; } }
        .gb-modal {
          background: #fff;
          border-radius: 14px;
          padding: 28px 24px;
          width: 340px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          animation: slideUp 0.2s ease;
        }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .gb-modal h3 {
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 6px;
          color: #111;
        }
        .gb-modal p { font-size: 12.5px; color: #888; margin: 0 0 16px; }
        .gb-modal input {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .gb-modal input:focus { border-color: #FFD700; }
        .gb-modal .err { font-size: 12px; color: #ef4444; margin-top: 6px; }
        .gb-modal .gb-modal-btns {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }
        .gb-modal .gb-modal-btns button {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          border: none;
          transition: opacity 0.2s;
        }
        .gb-modal .gb-modal-btns button:hover { opacity: 0.85; }
        .gb-btn-cancel { background: #f0f0f0; color: #333; }
        .gb-btn-save { background: #FFD700; color: #111; }

        /* Mobile hamburger */
        .gb-hamburger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          flex-direction: column;
          gap: 5px;
          padding: 4px;
        }
        .gb-hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: #111;
          border-radius: 2px;
          transition: all 0.3s;
        }

        @media (max-width: 768px) {
          .gb-nav-mid { padding: 10px 16px; }
          .gb-nav-bottom-inner { display: none; }
          .gb-hamburger { display: flex; }
          .gb-deliver-text strong { font-size: 12px; }
          .gb-logo { font-size: 18px; }

          .gb-mobile-menu {
            display: flex;
            flex-direction: column;
            background: #fff;
            border-top: 1px solid #f0f0f0;
          }
          .gb-mobile-menu a, .gb-mobile-menu button.gb-nav-link {
            padding: 13px 20px;
            border-bottom: 1px solid #f5f5f5;
            font-size: 14px;
            color: #222;
            font-weight: 500;
            text-decoration: none;
            font-family: 'Inter', sans-serif;
            display: block;
            background: none;
            border-left: none;
            border-right: none;
            border-top: none;
            cursor: pointer;
            text-align: left;
          }
          .gb-mobile-submenu a {
            padding-left: 36px;
            font-size: 13px;
            color: #555;
            background: #fafafa;
          }
        }
      `}</style>

            <AnnouncementBar />

            <nav className="gb-nav">

                {/* ── Middle Row ── */}
                <div style={{ position: "relative" }}>
                    <div className="gb-nav-mid">

                        {/* Left: Delivery badge */}
                        <button className="gb-delivery-badge" onClick={() => setShowModal(true)}>
                            <div className="gb-mins-box">
                                <span>60</span>
                                Mins
                            </div>
                            <div className="gb-deliver-text">
                                <small>Deliver To</small>
                                <strong>
                                    <LocationPin />
                                    {pincode} ▾
                                </strong>
                            </div>
                        </button>

                        {/* Center: Logo (absolute centered) */}
                        <Link to="/" className="gb-logo">
                            <div className="gb-logo-icon">⚡</div>
                            GoBuild
                        </Link>

                        {/* Right: Icons */}
                        <div className="gb-icon-group">

                            {/* Mobile hamburger */}
                            <button className="gb-hamburger" onClick={() => setMobileOpen(p => !p)}>
                                <span /><span /><span />
                            </button>

                            <button className="gb-icon-btn" onClick={() => navigate("/search")} title="Search">
                                <SearchIcon />
                            </button>

                            {/* User dropdown */}
                            <div ref={userMenuRef} style={{ position: "relative" }}>
                                <button
                                    className="gb-icon-btn"
                                    onClick={() => setShowUserMenu(p => !p)}
                                    title="Account"
                                >
                                    <UserIcon />
                                </button>
                                {showUserMenu && (
                                    <div className="gb-user-popup">
                                        {!token ? (
                                            <>
                                                <button onClick={() => { navigate("/login"); setShowUserMenu(false); }}>Login</button>
                                                <button onClick={() => { navigate("/signup"); setShowUserMenu(false); }}>Sign Up</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => { navigate("/my-profile"); setShowUserMenu(false); }}>My Profile</button>
                                                <button onClick={() => { navigate("/my-orders"); setShowUserMenu(false); }}>My Orders</button>
                                                <hr />
                                                <button className="danger" onClick={handleLogout}>Logout</button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Cart */}
                            <button className="gb-icon-btn" onClick={() => navigate("/cart")} title="Cart">
                                <CartIcon />
                                {cartCount > 0 && (
                                    <span className="gb-cart-badge">{cartCount}</span>
                                )}
                            </button>

                        </div>
                    </div>
                </div>

                {/* ── Bottom Nav Row (Desktop) ── */}
                <div className="gb-nav-bottom">
                    <div className="gb-nav-bottom-inner">

                        <div className="gb-nav-item">
                            <Link to="/" className="gb-nav-link">Home</Link>
                        </div>

                        {parentCats.map(parent => (
                            <div key={parent._id} className="gb-nav-item">
                                <span className="gb-nav-link" style={{ userSelect: "none" }}>
                                    {parent.name}
                                    {childMap[parent._id] && (
                                        <span style={{ marginLeft: 2, opacity: 0.6 }}><ChevronDown /></span>
                                    )}
                                </span>
                                {childMap[parent._id] && (
                                    <div className="gb-dropdown">
                                        {childMap[parent._id].map(child => (
                                            <Link
                                                key={child._id}
                                                to={`/category/${child._id}`}
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                    </div>
                </div>

                {/* ── Mobile Menu ── */}
                {mobileOpen && (
                    <div className="gb-mobile-menu">
                        <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
                        {parentCats.map(parent => (
                            <div key={parent._id}>
                                <button
                                    className="gb-nav-link"
                                    onClick={() => setOpenCat(openCat === parent._id ? null : parent._id)}
                                >
                                    {parent.name} {childMap[parent._id] && <ChevronDown />}
                                </button>
                                {openCat === parent._id && childMap[parent._id] && (
                                    <div className="gb-mobile-submenu">
                                        {childMap[parent._id].map(child => (
                                            <Link
                                                key={child._id}
                                                to={`/category/${child._id}`}
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

            </nav>

            {/* ── Pincode Modal ── */}
            {showModal && (
                <div className="gb-overlay" onClick={() => setShowModal(false)}>
                    <div className="gb-modal" onClick={e => e.stopPropagation()}>
                        <h3>📍 Enter Pincode</h3>
                        <p>Check delivery availability in your area</p>
                        <input
                            type="text"
                            value={inputPin}
                            onChange={e => setInputPin(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handlePinSubmit()}
                            placeholder="e.g. 180001"
                            maxLength={6}
                            autoFocus
                        />
                        {pinError && <div className="err">{pinError}</div>}
                        <div className="gb-modal-btns">
                            <button className="gb-btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="gb-btn-save" onClick={handlePinSubmit}>Check & Save</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}