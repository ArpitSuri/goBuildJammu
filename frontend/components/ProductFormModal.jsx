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
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-gray-900 p-6 rounded w-full max-w-lg space-y-4 text-white max-h-[90vh] overflow-y-auto">

                <h2 className="text-xl font-bold">Create Product</h2>

                {/* BASIC INFO */}
                <input
                    className="w-full p-2 bg-gray-800 rounded"
                    placeholder="Product name (e.g. Marine Plywood 18mm)"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <textarea
                    className="w-full p-2 bg-gray-800 rounded"
                    placeholder="Describe product (grade, usage, quality...)"
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <select
                    className="w-full p-2 bg-gray-800 rounded"
                    onChange={(e) => {
                        setForm({
                            ...form,
                            category: e.target.value,
                            attributes: [] // reset
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
                    placeholder="Brand (e.g. GreenPly)"
                    className="w-full p-2 bg-gray-800 rounded"
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                />

                <input
                    placeholder="Unit (e.g. sheet, piece, kg)"
                    className="w-full p-2 bg-gray-800 rounded"
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                />

                <input
                    placeholder="Tags (e.g. plywood, marine, waterproof)"
                    className="w-full p-2 bg-gray-800 rounded"
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />

                {/* IMAGES */}
                <div>
                    <p className="font-semibold">Images</p>

                    <input type="file" multiple onChange={handleImageUpload} />

                    {uploading && (
                        <p className="text-sm text-gray-400">Uploading...</p>
                    )}

                    <div className="flex gap-2 flex-wrap mt-2">
                        {images.map((img, i) => (
                            <div key={i} className="relative">
                                <img
                                    src={img.url}
                                    className="w-20 h-20 object-cover rounded"
                                />

                                <button
                                    onClick={() => removeImage(i)}
                                    className="absolute top-0 right-0 bg-red-600 text-xs px-1"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SPECIFICATIONS */}
                <div>
                    <p className="font-semibold">Specifications</p>

                    <div className="flex gap-2">
                        <input
                            placeholder="Spec name (e.g. Thickness)"
                            className="p-2 bg-gray-800 rounded w-1/2"
                            value={specKey}
                            onChange={(e) => setSpecKey(e.target.value)}
                        />
                        <input
                            placeholder="Spec value (e.g. 18mm)"
                            className="p-2 bg-gray-800 rounded w-1/2"
                            value={specValue}
                            onChange={(e) => setSpecValue(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleAddSpec}
                        className="text-blue-400 text-sm mt-1"
                    >
                        + Add Spec
                    </button>
                </div>

                {/* ATTRIBUTES */}
                <div>
                    <p className="font-semibold">Attributes</p>

                    {filteredAttributes.map(attr => (
                        <div key={attr._id}>
                            <label>{attr.name}</label>

                            {attr.type === "select" ? (
                                <select
                                    className="w-full p-2 bg-gray-800 rounded"
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
                                    className="w-full p-2 bg-gray-800 rounded"
                                    placeholder={`Enter ${attr.name.toLowerCase()}`}
                                    onChange={(e) =>
                                        handleAttributeChange(attr._id, e.target.value)
                                    }
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* ACTIONS */}
                <button
                    onClick={handleSubmit}
                    className="w-full bg-green-600 p-2 rounded"
                >
                    Save Product
                </button>

                <button
                    onClick={onClose}
                    className="w-full text-gray-400"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}