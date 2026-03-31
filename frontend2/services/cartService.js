import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/cart`;

const getToken = () => localStorage.getItem("token");

// Get cart
export const getCart = () =>
    axios.get(API, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

// Add to cart
export const addToCart = (variantId, quantity) =>
    axios.post(
        API,
        { variantId, quantity },
        { headers: { Authorization: `Bearer ${getToken()}` } }
    );

// Update quantity
export const updateCartItem = (variantId, quantity) =>
    axios.put(
        API,
        { variantId, quantity },
        { headers: { Authorization: `Bearer ${getToken()}` } }
    );

// Remove item
export const removeCartItem = (variantId) =>
    axios.delete(`${API}/${variantId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

// Clear cart
export const clearCart = () =>
    axios.delete(API, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });