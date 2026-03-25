import { useEffect, useState } from "react";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../../../services/categoryService";

import CategoryFormModal from "../../../components/CategoryFormModal";
import CategoryList from "../../../components/CategoryList";

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);

    const fetchCategories = async () => {
        const res = await getCategories();
        setCategories(res.data.categories);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (data) => {
        await createCategory(data);
        fetchCategories();
    };

    const handleUpdate = async (data) => {
        await updateCategory(editData._id, data);
        setEditData(null);
        fetchCategories();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        await deleteCategory(id);
        fetchCategories();
    };

    return (
  <div className="p-6 bg-gray-100 min-h-screen">

    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Categories
        </h1>
        <p className="text-sm text-gray-500">
          Manage your product categories
        </p>
      </div>

      <button
        onClick={() => {
          setEditData(null);
          setShowModal(true);
        }}
        className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg shadow-sm transition"
      >
        + Add Category
      </button>
    </div>

    {/* Content Card */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">

      {categories.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-sm">
            No categories found
          </p>
        </div>
      ) : (
        <CategoryList
          categories={categories}
          onEdit={(cat) => {
            setEditData(cat);
            setShowModal(true);
          }}
          onDelete={handleDelete}
        />
      )}
    </div>

    {/* Modal */}
    <CategoryFormModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onSubmit={editData ? handleUpdate : handleCreate}
      categories={categories}
      editData={editData}
    />
  </div>
);
}