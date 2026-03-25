import { useState, useEffect } from "react";
import { uploadImage } from "../services/cloudinaryService";


export default function CategoryFormModal({
    isOpen,
    onClose,
    onSubmit,
    categories,
    editData
}) {
    const [name, setName] = useState("");
    const [parent, setParent] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setParent(editData.parent?._id || "");
      setImage(editData.image || null); // ✅ ADD
    }
  }, [editData]);

    if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({
      name,
      parent: parent || null,
      image   // ✅ ADD THIS
    });

    onClose();
    setName("");
    setParent("");
    setImage(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Only images allowed");
    if (file.size > 2 * 1024 * 1024) return alert("Max 2MB");

    try {
      setUploading(true);
      const res = await uploadImage(file);
      setImage(res);
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
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

          <div className="mb-4">
            <label className="text-sm text-gray-600">Category Image (Optional)</label>

            <input
              type="file"
              onChange={handleImageUpload}
              className="w-full mt-1"
            />

            {uploading && (
              <p className="text-sm text-gray-500 mt-1">Uploading...</p>
            )}

            {image?.url && (
              <img
                src={image.url}
                alt="preview"
                className="mt-2 h-20 rounded"
              />
            )}
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