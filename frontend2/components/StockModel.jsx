import { useState } from "react";
import { updateStock } from "../services/variantService";

const StockModal = ({ variant, onClose, refresh }) => {
    const [qty, setQty] = useState("");

    const handleUpdate = async () => {
        if (!qty || qty <= 0) return;

        try {
            await updateStock(variant._id, Number(qty));
            refresh();
            onClose();
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    return (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm">

      {/* Heading */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Update Stock
      </h2>

      {/* Input */}
      <div className="mb-6">
        <label className="text-sm text-gray-600">Quantity</label>
        <input
          type="number"
          placeholder="Enter quantity"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          disabled={!qty || qty <= 0}
          className="flex-1 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition disabled:opacity-50"
        >
          Update
        </button>
      </div>

    </div>
  </div>
);
};

export default StockModal;