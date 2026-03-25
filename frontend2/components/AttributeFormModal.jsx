import { useState, useEffect } from "react";
import CustomSelect from "./CustomSelect";
export default function AttributeFormModal({
    isOpen,
    onClose,
    onSubmit,
    editData,
    categories
}) {
    const [name, setName] = useState("");
    const [type, setType] = useState("text");
    const [options, setOptions] = useState([""]);
    const [category, setCategory] = useState("");
    const [isVariant, setIsVariant] = useState(false);
    const [unit, setUnit] = useState("");

    useEffect(() => {
        if (editData) {
            setName(editData.name);
            setType(editData.type);
            setOptions(editData.options.length ? editData.options : [""]);
            setCategory(editData.category?._id || "");
            setIsVariant(editData.isVariant);
            setUnit(editData.unit || "");
        }
    }, [editData]);

    if (!isOpen) return null;

    const handleOptionChange = (i, value) => {
        const newOptions = [...options];
        newOptions[i] = value;
        setOptions(newOptions);
    };

    const addOption = () => setOptions([...options, ""]);

    const handleSubmit = () => {
        onSubmit({
            name,
            type,
            options: type === "select" ? options : [],
            category,
            isVariant,
            unit
        });

        onClose();
    };

    return (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">

      {/* Heading */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        {editData ? "Edit Attribute" : "Create Attribute"}
      </h2>

      {/* Name */}
      <div className="mb-4">
        <label className="text-sm text-gray-600">Attribute Name</label>
        <input
          className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
          placeholder="Enter attribute name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Type */}
      <div className="mb-4">
        <label className="text-sm text-gray-600">Type</label>
        <select
          className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="select">Select</option>
        </select>
      </div>

      {/* Options (only for select) */}
      {type === "select" && (
        <div className="mb-4">
          <label className="text-sm text-gray-600">Options</label>

          <div className="space-y-2 mt-2 max-h-32 overflow-y-auto pr-1">
            {options.map((opt, i) => (
              <input
                key={i}
                className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
                value={opt}
                onChange={(e) =>
                  handleOptionChange(i, e.target.value)
                }
                placeholder={`Option ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={addOption}
            className="text-sm text-green-700 mt-2 hover:underline"
          >
            + Add option
          </button>
        </div>
      )}

      {/* Category */}
      <div className="mb-4">
        <label className="text-sm text-gray-600">Category</label>
        <CustomSelect
  options={[
    { value: "", label: "Select Category" },
    ...categories.map((c) => ({
      value: c._id,
      label: c.name,
    })),
  ]}
  value={category}
  onChange={(val) => setCategory(val)}
/>
      </div>

      {/* Variant Toggle */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-gray-600">Is Variant</span>

        <input
          type="checkbox"
          checked={isVariant}
          onChange={(e) => setIsVariant(e.target.checked)}
          className="w-4 h-4 accent-green-700"
        />
      </div>

      {/* Unit */}
      <div className="mb-6">
        <label className="text-sm text-gray-600">Unit (optional)</label>
        <input
          className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
          placeholder="e.g. kg, cm"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />
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