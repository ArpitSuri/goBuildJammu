// import { useState } from "react";
// import { uploadImage } from "../services/cloudinaryService";

// export default function ProductFormModal({
//     isOpen,
//     onClose,
//     onSubmit,
//     categories,
//     attributes
// }) {
//     const [form, setForm] = useState({
//         name: "",
//         description: "",
//         category: "",
//         brand: "",
//         unit: "",
//         tags: "",
//         specifications: {},
//         attributes: []
//     });

//     const [images, setImages] = useState([]);
//     const [uploading, setUploading] = useState(false);

//     const [specKey, setSpecKey] = useState("");
//     const [specValue, setSpecValue] = useState("");

//     if (!isOpen) return null;

//     /* ---------------- IMAGE UPLOAD ---------------- */
//     const handleImageUpload = async (e) => {
//         const files = Array.from(e.target.files);

//         // 🔥 validations
//         if (files.length > 5) return alert("Max 5 images allowed");

//         try {
//             setUploading(true);

//             const uploaded = [];

//             for (const file of files) {
//                 if (!file.type.startsWith("image/")) {
//                     alert("Only images allowed");
//                     continue;
//                 }

//                 if (file.size > 2 * 1024 * 1024) {
//                     alert("Max size 2MB");
//                     continue;
//                 }

//                 const res = await uploadImage(file);
//                 uploaded.push(res);
//             }

//             setImages((prev) => [...prev, ...uploaded]);

//         } catch (err) {
//             alert("Upload failed");
//         } finally {
//             setUploading(false);
//         }
//     };

//     const removeImage = (index) => {
//         setImages(images.filter((_, i) => i !== index));
//     };

//     /* ---------------- SPEC ---------------- */
//     const handleAddSpec = () => {
//         if (!specKey || !specValue) return;

//         setForm({
//             ...form,
//             specifications: {
//                 ...form.specifications,
//                 [specKey]: specValue
//             }
//         });

//         setSpecKey("");
//         setSpecValue("");
//     };

//     /* ---------------- ATTRIBUTES ---------------- */
//     const handleAttributeChange = (attrId, value) => {
//         const updated = form.attributes.filter(a => a.attribute !== attrId);

//         setForm({
//             ...form,
//             attributes: [...updated, { attribute: attrId, value }]
//         });
//     };

//     /* ---------------- SUBMIT ---------------- */
//     const handleSubmit = () => {
//         if (!form.name || !form.category) {
//             return alert("Name and category required");
//         }

//         onSubmit({
//             ...form,
//             images,
//             tags: form.tags
//                 ? form.tags.split(",").map(t => t.trim()).filter(Boolean)
//                 : []
//         });

//         onClose();
//     };

//     return (
//         <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
//             <div className="bg-gray-900 p-6 rounded w-full max-w-lg space-y-4 text-white max-h-[90vh] overflow-y-auto">

//                 <h2 className="text-xl font-bold">Create Product</h2>

//                 {/* BASIC INFO */}
//                 <input
//                     className="w-full p-2 bg-gray-800 rounded"
//                     placeholder="Name"
//                     onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 />

//                 <textarea
//                     className="w-full p-2 bg-gray-800 rounded"
//                     placeholder="Description"
//                     onChange={(e) => setForm({ ...form, description: e.target.value })}
//                 />

//                 <select
//                     className="w-full p-2 bg-gray-800 rounded"
//                     onChange={(e) => setForm({ ...form, category: e.target.value })}
//                 >
//                     <option value="">Select Category</option>
//                     {categories.map(c => (
//                         <option key={c._id} value={c._id}>{c.name}</option>
//                     ))}
//                 </select>

//                 <input
//                     placeholder="Brand"
//                     className="w-full p-2 bg-gray-800 rounded"
//                     onChange={(e) => setForm({ ...form, brand: e.target.value })}
//                 />

//                 <input
//                     placeholder="Unit"
//                     className="w-full p-2 bg-gray-800 rounded"
//                     onChange={(e) => setForm({ ...form, unit: e.target.value })}
//                 />

//                 <input
//                     placeholder="Tags (comma separated)"
//                     className="w-full p-2 bg-gray-800 rounded"
//                     onChange={(e) => setForm({ ...form, tags: e.target.value })}
//                 />

//                 {/* IMAGES */}
//                 <div>
//                     <p className="font-semibold">Images</p>

//                     <input type="file" multiple onChange={handleImageUpload} />

//                     {uploading && (
//                         <p className="text-sm text-gray-400">Uploading...</p>
//                     )}

//                     <div className="flex gap-2 flex-wrap mt-2">
//                         {images.map((img, i) => (
//                             <div key={i} className="relative">
//                                 <img
//                                     src={img.url}
//                                     className="w-20 h-20 object-cover rounded"
//                                 />

//                                 <button
//                                     onClick={() => removeImage(i)}
//                                     className="absolute top-0 right-0 bg-red-600 text-xs px-1"
//                                 >
//                                     ✕
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* SPECIFICATIONS */}
//                 <div>
//                     <p className="font-semibold">Specifications</p>

//                     <div className="flex gap-2">
//                         <input
//                             placeholder="Key"
//                             className="p-2 bg-gray-800 rounded w-1/2"
//                             value={specKey}
//                             onChange={(e) => setSpecKey(e.target.value)}
//                         />
//                         <input
//                             placeholder="Value"
//                             className="p-2 bg-gray-800 rounded w-1/2"
//                             value={specValue}
//                             onChange={(e) => setSpecValue(e.target.value)}
//                         />
//                     </div>

//                     <button
//                         onClick={handleAddSpec}
//                         className="text-blue-400 text-sm mt-1"
//                     >
//                         + Add Spec
//                     </button>
//                 </div>

//                 {/* ATTRIBUTES */}
//                 <div>
//                     <p className="font-semibold">Attributes</p>

//                     {attributes.map(attr => (
//                         <div key={attr._id}>
//                             <label>{attr.name}</label>

//                             {attr.type === "select" ? (
//                                 <select
//                                     className="w-full p-2 bg-gray-800 rounded"
//                                     onChange={(e) =>
//                                         handleAttributeChange(attr._id, e.target.value)
//                                     }
//                                 >
//                                     <option value="">Select</option>
//                                     {attr.options.map(opt => (
//                                         <option key={opt} value={opt}>{opt}</option>
//                                     ))}
//                                 </select>
//                             ) : (
//                                 <input
//                                     className="w-full p-2 bg-gray-800 rounded"
//                                     placeholder="Value"
//                                     onChange={(e) =>
//                                         handleAttributeChange(attr._id, e.target.value)
//                                     }
//                                 />
//                             )}
//                         </div>
//                     ))}
//                 </div>

//                 {/* ACTIONS */}
//                 <button
//                     onClick={handleSubmit}
//                     className="w-full bg-green-600 p-2 rounded"
//                 >
//                     Save Product
//                 </button>

//                 <button
//                     onClick={onClose}
//                     className="w-full text-gray-400"
//                 >
//                     Cancel
//                 </button>
//             </div>
//         </div>
//     );
// }


import { useState } from "react";
import { uploadImage } from "../services/cloudinaryService";

export default function ProductFormModal({
    isOpen,
    onClose,
    onSubmit,
    categories,
    attributes
}) {
    const [form, setForm] = useState({
        name: "",
        description: "",
        category: "",
        brand: "",
        unit: "",
        tags: "",
        specifications: {},
        attributes: []
    });

    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    const [specKey, setSpecKey] = useState("");
    const [specValue, setSpecValue] = useState("");

    const [selectedCategory, setSelectedCategory] = useState("");

    if (!isOpen) return null;

    /* ---------------- IMAGE UPLOAD ---------------- */
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 5) return alert("Max 5 images allowed");

        try {
            setUploading(true);
            const uploaded = [];

            for (const file of files) {
                if (!file.type.startsWith("image/")) continue;
                if (file.size > 2 * 1024 * 1024) continue;

                const res = await uploadImage(file);
                uploaded.push(res);
            }

            setImages((prev) => [...prev, ...uploaded]);
        } catch {
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    /* ---------------- SPEC ---------------- */
    const handleAddSpec = () => {
        if (!specKey || !specValue) return;

        setForm({
            ...form,
            specifications: {
                ...form.specifications,
                [specKey]: specValue
            }
        });

        setSpecKey("");
        setSpecValue("");
    };

    /* ---------------- ATTRIBUTES ---------------- */
    const handleAttributeChange = (attrId, value) => {
        const updated = form.attributes.filter(a => a.attribute !== attrId);

        setForm({
            ...form,
            attributes: [...updated, { attribute: attrId, value }]
        });
    };

    /* ---------------- FILTER ATTRIBUTES ---------------- */
    const filteredAttributes = attributes.filter(
        (attr) => attr.category?._id === selectedCategory
    );

    /* ---------------- SUBMIT ---------------- */
    const handleSubmit = () => {
        if (!form.name || !form.category) {
            return alert("Name and category required");
        }

        onSubmit({
            ...form,
            images,
            tags: form.tags
                ? form.tags.split(",").map(t => t.trim()).filter(Boolean)
                : []
        });

        onClose();
    };

    return (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">

      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Create Product
      </h2>

      {/* BASIC INFO */}
      <div className="space-y-4">

        <input
          className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
          placeholder="Product name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <textarea
          className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
          placeholder="Product description"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <select
          className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
          onChange={(e) => {
            setForm({
              ...form,
              category: e.target.value,
              attributes: []
            });
            setSelectedCategory(e.target.value);
          }}
        >
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <input
          placeholder="Brand"
          className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
        />

        <input
          placeholder="Unit (kg, piece...)"
          className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
        />

        <input
          placeholder="Tags (comma separated)"
          className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />
      </div>

      {/* IMAGES */}
      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Images</p>

        <input type="file" multiple onChange={handleImageUpload} />

        {uploading && (
          <p className="text-sm text-gray-500 mt-1">Uploading...</p>
        )}

        <div className="flex gap-2 flex-wrap mt-3">
          {images.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={img.url}
                className="w-20 h-20 object-cover rounded-lg border"
              />

              <button
                onClick={() => removeImage(i)}
                className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SPECIFICATIONS */}
      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Specifications
        </p>

        <div className="flex gap-2">
          <input
            placeholder="Key"
            className="p-2 border rounded-lg w-1/2"
            value={specKey}
            onChange={(e) => setSpecKey(e.target.value)}
          />
          <input
            placeholder="Value"
            className="p-2 border rounded-lg w-1/2"
            value={specValue}
            onChange={(e) => setSpecValue(e.target.value)}
          />
        </div>

        <button
          onClick={handleAddSpec}
          className="text-green-700 text-sm mt-2 hover:underline"
        >
          + Add Specification
        </button>
      </div>

      {/* ATTRIBUTES */}
      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Attributes
        </p>

        <div className="space-y-3">
          {filteredAttributes.map(attr => (
            <div key={attr._id}>
              <label className="text-sm text-gray-600">
                {attr.name}
              </label>

              {attr.type === "select" ? (
                <select
                  className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
                  onChange={(e) =>
                    handleAttributeChange(attr._id, e.target.value)
                  }
                >
                  <option value="">Select {attr.name}</option>
                  {attr.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
                  placeholder={`Enter ${attr.name}`}
                  onChange={(e) =>
                    handleAttributeChange(attr._id, e.target.value)
                  }
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 mt-6">
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
          Save Product
        </button>
      </div>
    </div>
  </div>
);
}