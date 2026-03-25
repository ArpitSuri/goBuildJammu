import { useEffect, useState } from "react";
import {
    createSupplier,
    updateSupplier
} from "../services/supplierService";

export default function SupplierModal({ isOpen, onClose, refresh, editData }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        businessName: "",
        gstNumber: "",
        address: "",
        city: "",
        state: "",
        pinCode: "",
        isApproved: false
    });

    useEffect(() => {
        if (editData) {
            setForm({
                name: editData.user?.name || "",
                email: editData.user?.email || "",
                phone: editData.user?.phone || "",
                password: "",
                businessName: editData.businessName || "",
                gstNumber: editData.gstNumber || "",
                address: editData.address || "",
                city: editData.city || "",
                state: editData.state || "",
                pinCode: editData.pinCode || "",
                isApproved: editData.isApproved
            });
        }
    }, [editData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async () => {
        try {
            if (editData) {
                await updateSupplier(editData._id, form);
            } else {
                await createSupplier(form);
            }

            refresh();
            onClose();
        } catch (err) {
            console.log(err);
            alert("Error");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white p-6 rounded w-[500px] space-y-3">
                <h2 className="text-xl font-bold">
                    {editData ? "Edit Supplier" : "Add Supplier"}
                </h2>

                <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="input" />
                <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="input" />
                <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="input" />

                {!editData && (
                    <input name="password" placeholder="Password" onChange={handleChange} className="input" />
                )}

                <input name="businessName" placeholder="Business Name" value={form.businessName} onChange={handleChange} className="input" />
                <input name="gstNumber" placeholder="GST Number" value={form.gstNumber} onChange={handleChange} className="input" />

                <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="input" />
                <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="input" />
                <input name="state" placeholder="State" value={form.state} onChange={handleChange} className="input" />
                <input name="pinCode" placeholder="Pincode" value={form.pinCode} onChange={handleChange} className="input" />

                <label className="flex gap-2">
                    <input
                        type="checkbox"
                        name="isApproved"
                        checked={form.isApproved}
                        onChange={handleChange}
                    />
                    Approved
                </label>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose}>Cancel</button>
                    <button
                        onClick={handleSubmit}
                        className="bg-black text-white px-4 py-1 rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}