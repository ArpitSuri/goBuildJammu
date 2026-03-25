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
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">

      {/* Heading */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        {editData ? "Edit Supplier" : "Add Supplier"}
      </h2>

      <div className="space-y-4">

        {/* BASIC INFO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
          />

          {!editData && (
            <input
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
            />
          )}
        </div>

        {/* BUSINESS INFO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            name="businessName"
            placeholder="Business Name"
            value={form.businessName}
            onChange={handleChange}
            className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
          />

          <input
            name="gstNumber"
            placeholder="GST Number"
            value={form.gstNumber}
            onChange={handleChange}
            className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* ADDRESS */}
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
          />

          <input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
          />

          <input
            name="pinCode"
            placeholder="Pincode"
            value={form.pinCode}
            onChange={handleChange}
            className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* APPROVAL */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Approved
          </span>

          <input
            type="checkbox"
            name="isApproved"
            checked={form.isApproved}
            onChange={handleChange}
            className="w-4 h-4 accent-green-700"
          />
        </div>

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
}