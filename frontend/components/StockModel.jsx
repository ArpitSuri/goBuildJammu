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
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl">
                <h2 className="font-semibold mb-4">Update Stock</h2>

                <input
                    type="number"
                    placeholder="Quantity"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="border p-2 w-full mb-4"
                />

                <button
                    onClick={handleUpdate}
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    Update
                </button>
            </div>
        </div>
    );
};

export default StockModal;