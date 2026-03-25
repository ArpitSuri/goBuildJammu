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
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">

      {/* Heading */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        {variant ? "Edit Variant" : "Create Variant"}
      </h2>

      {/* BASIC INFO */}
      <div className="space-y-3">

        <input
              placeholder="unique internal identifier for a specific product variant."
          value={form.sku}
          onChange={(e) => setForm({ ...form, sku: e.target.value })}
          className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
        />

        <input
          type="number"
          placeholder="Discount Price"
          value={form.discountPrice}
          onChange={(e) =>
            setForm({ ...form, discountPrice: e.target.value })
          }
          className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
        />

        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) =>
            setForm({ ...form, stock: e.target.value })
          }
          className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      {/* ATTRIBUTES */}
      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Attributes
        </p>

        <div className="space-y-3">
          {attributes.map((attr, i) => {
            const selectedAttr = allAttributes.find(
              a => a._id === attr.attribute
            );

            return (
              <div key={i} className="flex gap-2">

                {/* Attribute */}
                <select
                  value={attr.attribute}
                  onChange={(e) =>
                    handleAttrChange(i, "attribute", e.target.value)
                  }
                  className="w-1/2 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
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

                {/* Value */}
                <select
                  value={attr.value}
                  onChange={(e) =>
                    handleAttrChange(i, "value", e.target.value)
                  }
                  className="w-1/2 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
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
        </div>

        <button
          onClick={addAttribute}
          className="text-green-700 text-sm mt-2 hover:underline"
        >
          + Add Attribute
        </button>
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
          Save
        </button>
      </div>

    </div>
  </div>
);
};

export default VariantFormModal;