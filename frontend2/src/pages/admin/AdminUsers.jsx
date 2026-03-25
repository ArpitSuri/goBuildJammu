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
  <div className="p-6 bg-gray-100 min-h-screen">

    {/* Header */}
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Manage Users
      </h1>
      <p className="text-sm text-gray-500">
        Add suppliers and delivery agents
      </p>
    </div>

    {/* Actions Card */}
    <div className="bg-white border rounded-2xl shadow-sm p-6">

      <div className="flex flex-col sm:flex-row gap-4">

        {/* Supplier Card */}
        <div className="flex-1 border rounded-xl p-4 hover:shadow-md transition">
          <h2 className="text-lg font-medium text-gray-800 mb-2">
            Suppliers
          </h2>

          <p className="text-sm text-gray-500 mb-4">
            Add and manage supplier accounts
          </p>

          <button
            onClick={() => setSupplierOpen(true)}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition"
          >
            + Add Supplier
          </button>
        </div>

        {/* Delivery Card */}
        <div className="flex-1 border rounded-xl p-4 hover:shadow-md transition">
          <h2 className="text-lg font-medium text-gray-800 mb-2">
            Delivery Agents
          </h2>

          <p className="text-sm text-gray-500 mb-4">
            Add and manage delivery staff
          </p>

          <button
            onClick={() => setDeliveryOpen(true)}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition"
          >
            + Add Delivery
          </button>
        </div>

      </div>
    </div>

    {/* Modals */}
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