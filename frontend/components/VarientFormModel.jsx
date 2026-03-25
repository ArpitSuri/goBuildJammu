import { useEffect, useState } from "react";
import {
    createVariant,
    updateVariant
} from "../services/variantService";
import axios from "axios";

const VariantFormModal = ({ productId, variant, onClose, refresh }) => {
    const [attributes, setAttributes] = useState([]);
    const [allAttributes, setAllAttributes] = useState([]);

    const [form, setForm] = useState({
        sku: "",
        price: "",
        discountPrice: "",
        stock: 0
    });

    useEffect(() => {
        fetchAttributes();

        if (variant) {
            setForm({
                sku: variant.sku || "",
                price: variant.price,
                discountPrice: variant.discountPrice || "",
                stock: variant.stock
            });
            setAttributes(variant.attributes || []);
        }
    }, []);

    const fetchAttributes = async () => {
        const { data } = await axios.get("http://localhost:5000/api/attributes");
        setAllAttributes(data.attributes);
    };

    const handleAttrChange = (i, field, value) => {
        const updated = [...attributes];
        updated[i][field] = value;

        // Reset value if attribute changes
        if (field === "attribute") {
            updated[i].value = "";
        }

        setAttributes(updated);
    };

    const addAttribute = () => {
        setAttributes([...attributes, { attribute: "", value: "" }]);
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...form,
                product: productId,
                attributes
            };

            if (variant) {
                await updateVariant(variant._id, payload);
            } else {
                await createVariant(payload);
            }

            refresh();
            onClose();
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    // Prevent duplicate attribute selection
    const selectedAttrIds = attributes.map(a => a.attribute);

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl w-[500px]">
                <h2 className="font-semibold mb-4">
                    {variant ? "Edit Variant" : "Create Variant"}
                </h2>

                {/* SKU */}
                <input
                    placeholder="SKU"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="border p-2 w-full mb-2"
                />

                {/* Price */}
                <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="border p-2 w-full mb-2"
                />

                {/* Discount */}
                <input
                    type="number"
                    placeholder="Discount Price"
                    value={form.discountPrice}
                    onChange={(e) =>
                        setForm({ ...form, discountPrice: e.target.value })
                    }
                    className="border p-2 w-full mb-4"
                />

                <h4 className="font-medium mb-2">Attributes</h4>

                {attributes.map((attr, i) => {
                    const selectedAttr = allAttributes.find(
                        a => a._id === attr.attribute
                    );

                    return (
                        <div key={i} className="flex gap-2 mb-2">
                            {/* ATTRIBUTE SELECT */}
                            <select
                                value={attr.attribute}
                                onChange={(e) =>
                                    handleAttrChange(i, "attribute", e.target.value)
                                }
                                className="border p-2 w-1/2"
                            >
                                <option value="">Select Attribute</option>
                                {allAttributes.map((a) => (
                                    <option
                                        key={a._id}
                                        value={a._id}
                                        disabled={
                                            selectedAttrIds.includes(a._id) &&
                                            a._id !== attr.attribute
                                        }
                                    >
                                        {a.name}
                                    </option>
                                ))}
                            </select>

                            {/* VALUE SELECT (OPTIONS) */}
                            <select
                                value={attr.value}
                                onChange={(e) =>
                                    handleAttrChange(i, "value", e.target.value)
                                }
                                className="border p-2 w-1/2"
                                disabled={!attr.attribute}
                            >
                                <option value="">Select Value</option>

                                {selectedAttr?.options?.map((opt, idx) => (
                                    <option key={idx} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                })}

                <button
                    onClick={addAttribute}
                    className="text-blue-600 mb-4"
                >
                    + Add Attribute
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={handleSubmit}
                        className="bg-black text-white px-4 py-2 rounded"
                    >
                        Save
                    </button>

                    <button onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VariantFormModal;