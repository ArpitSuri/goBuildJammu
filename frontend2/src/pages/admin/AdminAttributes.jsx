import { useEffect, useState } from "react";

import CustomSelect from "../../../components/CustomSelect";
import {
    getAttributes,
    createAttribute,
    updateAttribute,
    deleteAttribute
} from "../../../services/attributeServie";

import { getCategories } from "../../../services/categoryService";

import AttributeFormModal from "../../../components/AttributeFormModal";
import AttributeList from "../../../components/AttributeList";

export default function AdminAttributes() {
    const [attributes, setAttributes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);

    const fetchAll = async () => {
        const attrRes = await getAttributes(selectedCategory);
        const catRes = await getCategories();

        setAttributes(attrRes.data.attributes);
        setCategories(catRes.data.categories);
    };

    useEffect(() => {
        fetchAll();
    }, [selectedCategory]);

    const handleCreate = async (data) => {
        await createAttribute(data);
        fetchAll();
    };

    const handleUpdate = async (data) => {
        await updateAttribute(editData._id, data);
        setEditData(null);
        fetchAll();
    };

    const handleDelete = async (id) => {
        if (!confirm("Disable this attribute?")) return;
        await deleteAttribute(id);
        fetchAll();
    };

    return (
  <div className="p-6 bg-gray-100 min-h-screen">

    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Attributes
        </h1>
        <p className="text-sm text-gray-500">
          Manage product attributes
        </p>
      </div>

      <button
        onClick={() => {
          setEditData(null);
          setShowModal(true);
        }}
        className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg shadow-sm transition"
      >
        + Add Attribute
      </button>
    </div>

    {/* Filter + Content Card */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">

      {/* Filter Row */}
      <div className="mb-4 max-w-xs">
        <label className="text-sm text-gray-600">Filter by Category</label>

        <CustomSelect
          options={[
            { value: "", label: "All Categories" },
            ...categories.map((c) => ({
              value: c._id,
              label: c.name,
            })),
          ]}
          value={selectedCategory}
          onChange={(val) => setSelectedCategory(val)}
        />
      </div>

      {/* List */}
      {attributes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-sm">
            No attributes found
          </p>
        </div>
      ) : (
        <AttributeList
          attributes={attributes}
          onEdit={(attr) => {
            setEditData(attr);
            setShowModal(true);
          }}
          onDelete={handleDelete}
        />
      )}
    </div>

    {/* Modal */}
    <AttributeFormModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onSubmit={editData ? handleUpdate : handleCreate}
      editData={editData}
      categories={categories}
    />
  </div>
);
}