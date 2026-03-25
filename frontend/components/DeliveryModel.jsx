import { useEffect, useState } from "react";
import { createDelivery, updateDelivery } from "../services/deliveryService";

const initialState = {
    name: "",
    email: "",
    phone: "",
    password: "",
    vehicleType: "",
    licenseNumber: "",
    isAvailable: true
};

export default function DeliveryModal({ isOpen, onClose, refresh, editData }) {
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);

    /* ---------------- LOAD EDIT DATA ---------------- */
    useEffect(() => {
        if (editData) {
            setForm({
                name: editData.user?.name || "",
                email: editData.user?.email || "",
                phone: editData.user?.phone || "",
                password: "",
                vehicleType: editData.vehicleType || "",
                licenseNumber: editData.licenseNumber || "",
                isAvailable: editData.isAvailable ?? true
            });
        } else {
            setForm(initialState); // reset on create
        }
    }, [editData, isOpen]);

    /* ---------------- HANDLE INPUT ---------------- */
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    /* ---------------- VALIDATION ---------------- */
    const validate = () => {
        if (!form.name || !form.email || !form.phone) {
            alert("Basic info missing");
            return false;
        }

        if (!editData && !form.password) {
            alert("Password required");
            return false;
        }

        return true;
    };

    /* ---------------- SUBMIT ---------------- */
    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setLoading(true);

            if (editData) {
                await updateDelivery(editData._id, form);
            } else {
                await createDelivery(form);
            }

            refresh();
            onClose();
            setForm(initialState);

        } catch (err) {
            console.error(err);
            alert(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white w-[420px] p-6 rounded-2xl shadow space-y-3">

                <h2 className="text-xl font-semibold">
                    {editData ? "Edit Delivery" : "Add Delivery"}
                </h2>

                {/* USER INFO */}
                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    className="input"
                />

                <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="input"
                />

                <input
                    name="phone"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="input"
                />

                {!editData && (
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="input"
                    />
                )}

                {/* DELIVERY INFO */}
                <input
                    name="vehicleType"
                    placeholder="Vehicle Type"
                    value={form.vehicleType}
                    onChange={handleChange}
                    className="input"
                />

                <input
                    name="licenseNumber"
                    placeholder="License Number"
                    value={form.licenseNumber}
                    onChange={handleChange}
                    className="input"
                />

                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        name="isAvailable"
                        checked={form.isAvailable}
                        onChange={handleChange}
                    />
                    Available for delivery
                </label>

                {/* ACTIONS */}
                <div className="flex justify-end gap-2 pt-2">
                    <button
                        onClick={onClose}
                        className="px-3 py-1 border rounded"
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-1 bg-black text-white rounded"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}