import { useEffect, useState } from "react";
import {
    getSuppliers,
    deleteSupplier
} from "../../../services/supplierService";
import SupplierModal from "../../../components/SupplierModel";

export default function SupplierPage() {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const fetchSuppliers = async () => {
        try {
            const { data } = await getSuppliers();
            setSuppliers(data.suppliers);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Delete supplier?")) return;

        await deleteSupplier(id);
        fetchSuppliers();
    };

    const handleEdit = (supplier) => {
        setEditData(supplier);
        setOpen(true);
    };

    if (loading) return <div>Loading...</div>;

    return (
  <div className="p-6 bg-gray-100 min-h-screen">

    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Suppliers
        </h1>
        <p className="text-sm text-gray-500">
          Manage your suppliers
        </p>
      </div>

      <button
        onClick={() => {
          setEditData(null);
          setOpen(true);
        }}
        className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg shadow-sm transition"
      >
        + Add Supplier
      </button>
    </div>

    {/* Table Card */}
    <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

      {suppliers.length === 0 ? (
        <div className="p-10 text-center text-gray-500">
          No suppliers found
        </div>
      ) : (
        <table className="w-full text-sm">

          {/* Head */}
          <thead className="bg-gray-50 text-gray-600">
            <tr className="text-left">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y">
            {suppliers.map((s) => (
              <tr key={s._id} className="hover:bg-gray-50 transition">

                <td className="px-4 py-3 font-medium text-gray-800">
                  {s.user?.name}
                </td>

                <td className="px-4 py-3 text-gray-500">
                  {s.user?.email}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {s.businessName}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {s.city}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  {s.isApproved ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Approved
                    </span>
                  ) : (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right space-x-3">
                  <button
                    onClick={() => handleEdit(s)}
                    className="text-gray-600 hover:text-green-700 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(s._id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

    {/* Modal */}
    <SupplierModal
      isOpen={open}
      onClose={() => setOpen(false)}
      refresh={fetchSuppliers}
      editData={editData}
    />
  </div>
);
}