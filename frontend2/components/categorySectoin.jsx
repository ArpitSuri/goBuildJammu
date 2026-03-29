// import { useEffect, useState } from "react";
// import { getCategories } from "../services/categoryService";
// import { Link } from "react-router-dom";

// export function CategoriesSection() {
//     const [categories, setCategories] = useState([]);

//     useEffect(() => {
//         fetchCategories();
//     }, []);

//     const fetchCategories = async () => {
//         try {
//             const { data } = await getCategories();
//             const all = data.categories;

//             const levelOne = all
//                 .filter(c => c.level === 1)
//                 .reverse();

//             setCategories(levelOne);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     return (
//         <div className="px-6 py-6">
//             <h2 className="text-lg font-semibold mb-4">
//                 Shop by Category
//             </h2>

//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
//                 {categories.map(cat => (
//                     <Link
//                         to={`/category/${cat._id}`}
//                         key={cat._id}
//                         className="border rounded-lg p-3 text-center hover:shadow-md hover:scale-105 cursor-pointer transition block"
//                     >
//                         <div className="w-full h-24 mb-2 flex items-center justify-center">
//                             <img
//                                 src={
//                                     cat.image?.url ||
//                                     "https://via.placeholder.com/150"
//                                 }
//                                 alt={cat.name}
//                                 className="h-full object-contain"
//                             />
//                         </div>

//                         <p className="text-sm font-medium">
//                             {cat.name}
//                         </p>
//                     </Link>
//                 ))}
//             </div>
//         </div>
//     );
// }

import { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";
import { Link } from "react-router-dom";

export function CategoriesSection() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await getCategories();
            const all = data.categories;
            const levelOne = all.filter(c => c.level === 1).reverse();
            setCategories(levelOne);
        } catch (err) {
            console.error(err);
        }
    };

    if (categories.length === 0) return null;

    return (
        <>
            <style>{`
                .hr-cats-section {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 40px 32px;
                    font-family: 'Inter', sans-serif;
                }
                .hr-cats-header {
                    display: flex;
                    align-items: baseline;
                    gap: 12px;
                    margin-bottom: 24px;
                }
                .hr-cats-title {
                    font-size: 22px;
                    font-weight: 700;
                    color: #111;
                    margin: 0;
                }
                .hr-cats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                    gap: 16px;
                }
                .hr-cat-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-decoration: none;
                    padding: 16px 12px 14px;
                    border-radius: 12px;
                    background: #f0f7ff;
                    border: 1.5px solid transparent;
                    transition: all 0.22s ease;
                    cursor: pointer;
                }
                .hr-cat-card:hover {
                    border-color: #FFD700;
                    background: #fffbeb;
                    transform: translateY(-3px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.09);
                }
                .hr-cat-img-wrap {
                    width: 90px;
                    height: 90px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 10px;
                }
                .hr-cat-img-wrap img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
                .hr-cat-name {
                    font-size: 13px;
                    font-weight: 600;
                    color: #222;
                    text-align: center;
                    line-height: 1.3;
                    margin: 0;
                }
                .hr-cat-card:hover .hr-cat-name {
                    color: #d97706;
                }
                @media (max-width: 640px) {
                    .hr-cats-section { padding: 24px 16px; }
                    .hr-cats-grid { grid-template-columns: repeat(3, 1fr); gap: 10px; }
                    .hr-cat-img-wrap { width: 64px; height: 64px; }
                }
            `}</style>

            <div className="hr-cats-section">
                <div className="hr-cats-header">
                    <h2 className="hr-cats-title">Shop by Category</h2>
                </div>

                <div className="hr-cats-grid">
                    {categories.map(cat => (
                        <Link
                            to={`/category/${cat._id}`}
                            key={cat._id}
                            className="hr-cat-card"
                        >
                            <div className="hr-cat-img-wrap">
                                <img
                                    src={cat.image?.url || "https://placehold.co/90x90/e8f4fd/555?text=+"}
                                    alt={cat.name}
                                />
                            </div>
                            <p className="hr-cat-name">{cat.name}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}