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

            const levelOne = all
                .filter(c => c.level === 1)
                .reverse();

            setCategories(levelOne);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="px-6 py-6">
            <h2 className="text-lg font-semibold mb-4">
                Shop by Category
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categories.map(cat => (
                    <Link
                        to={`/category/${cat._id}`}
                        key={cat._id}
                        className="border rounded-lg p-3 text-center hover:shadow-md hover:scale-105 cursor-pointer transition block"
                    >
                        <div className="w-full h-24 mb-2 flex items-center justify-center">
                            <img
                                src={
                                    cat.image?.url ||
                                    "https://via.placeholder.com/150"
                                }
                                alt={cat.name}
                                className="h-full object-contain"
                            />
                        </div>

                        <p className="text-sm font-medium">
                            {cat.name}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}