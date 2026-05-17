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
        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 py-16 font-sans">
            <div className="mb-10 text-center md:text-left">
                <h2 className="text-2xl lg:text-3xl font-light text-black tracking-tight mb-2">Shop by Category</h2>
                <div className="h-[1px] w-12 bg-black mx-auto md:mx-0"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {categories.map(cat => (
                    <Link
                        to={`/category/${cat._id}`}
                        key={cat._id}
                        className="group flex flex-col items-center p-6 border border-gray-100 bg-white hover:shadow-lg transition-all duration-300 ease-out cursor-pointer"
                    >
                        <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mb-6 overflow-hidden">
                            <img
                                src={cat.image?.url || "https://placehold.co/100x100/f8f9fa/e9ecef?text=+"}
                                alt={cat.name}
                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ease-out"
                            />
                        </div>
                        <p className="text-[12px] font-medium tracking-widest uppercase text-gray-600 text-center leading-relaxed group-hover:text-black transition-colors duration-300">
                            {cat.name}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}