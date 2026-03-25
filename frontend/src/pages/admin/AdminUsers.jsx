import { useState } from "react";
import SupplierModal from "../../../components/SupplierModel";
import DeliveryModal from "../../../components/DeliveryModel";

export default function AdminUsers() {
    const [supplierOpen, setSupplierOpen] = useState(false);
    const [deliveryOpen, setDeliveryOpen] = useState(false);

    const refresh = () => {
        // later: fetch suppliers/delivery list
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin - Manage Users</h1>

            <div className="flex gap-4">
                <button
                    onClick={() => setSupplierOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add Supplier
                </button>

                <button
                    onClick={() => setDeliveryOpen(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    Add Delivery
                </button>
            </div>

            <SupplierModal
                isOpen={supplierOpen}
                onClose={() => setSupplierOpen(false)}
                refresh={refresh}
            />

            <DeliveryModal
                isOpen={deliveryOpen}
                onClose={() => setDeliveryOpen(false)}
                refresh={refresh}
            />
        </div>
    );
}