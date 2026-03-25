import { useState, useEffect } from "react";

export default function CategoryFormModal({
    isOpen,
    onClose,
    onSubmit,
    categories,
    editData
}) {
    const [name, setName] = useState("");
    const [parent, setParent] = useState("");

    useEffect(() => {
        if (editData) {
            setName(editData.name);
            setParent(editData.parent?._id || "");
        }
    }, [editData]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit({ name, parent: parent || null });
        onClose();
        setName("");
        setParent("");
    };

    return (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">

      {/* Heading */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        {editData ? "Edit Category" : "Create Category"}
      </h2>

      {/* Name Input */}
      <div className="mb-4">
        <label className="text-sm text-gray-600">Category Name</label>
        <input
          className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
          placeholder="Enter category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Parent Select */}
      <div className="mb-6">
        <label className="text-sm text-gray-600">Parent Category</label>
        <select
  className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600 max-h-40 overflow-y-auto"
  value={parent}
  onChange={(e) => setParent(e.target.value)}
  size={5}   // 👈 THIS IS IMPORTANT
>
  <option value="">No Parent</option>
  {categories.map((cat) => (
    <option key={cat._id} value={cat._id}>
      {cat.name}
    </option>
  ))}
</select>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className="flex-1 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
        >
          Save
        </button>
      </div>
    </div>
  </div>
);
}