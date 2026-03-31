import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/variants`;

const getToken = () => localStorage.getItem("token");

/* ---------- PUBLIC ---------- */

// Get variants by product
export const getVariantsByProduct = (productId) =>
    axios.get(`${API}/product/${productId}`);


/* ---------- ADMIN ---------- */

// Create variant
export const createVariant = (data) =>
    axios.post(API, data, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

// Update variant
export const updateVariant = (id, data) =>
    axios.put(`${API}/${id}`, data, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

// Delete (soft delete)
export const deleteVariant = (id) =>
    axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

// Update stock
export const updateStock = (id, quantity) =>
    axios.put(`${API}/${id}/stock`, { quantity }, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

export const getDiscountedVariant = () =>
    axios.get(`${API}/discount`);