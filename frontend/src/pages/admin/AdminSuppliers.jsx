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
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Suppliers</h1>
                <button
                    onClick={() => {
                        setEditData(null);
                        setOpen(true);
                    }}
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    Add Supplier
                </button>
            </div>

            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-100">
                        <th>Name</th>
                        <th>Email</th>
                        <th>Business</th>
                        <th>City</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {suppliers.map((s) => (
                        <tr key={s._id} className="border-t text-center">
                            <td>{s.user?.name}</td>
                            <td>{s.user?.email}</td>
                            <td>{s.businessName}</td>
                            <td>{s.city}</td>
                            <td>
                                {s.isApproved ? "Approved" : "Pending"}
                            </td>
                            <td className="space-x-2">
                                <button
                                    onClick={() => handleEdit(s)}
                                    className="text-blue-600"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(s._id)}
                                    className="text-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <SupplierModal
                isOpen={open}
                onClose={() => setOpen(false)}
                refresh={fetchSuppliers}
                editData={editData}
            />
        </div>
    );
}