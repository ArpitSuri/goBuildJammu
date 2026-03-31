import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/orders`;

const getToken = () => localStorage.getItem("token");

const authHeader = () => ({
    headers: { Authorization: `Bearer ${getToken()}` }
});

/* ---------------- USER APIs ---------------- */

// Create order
export const createOrder = (data) =>
    axios.post(API, data, authHeader());
// Get my orders
export const getMyOrders = () =>
    axios.get(`${API}/my`, authHeader());

// Get single order
export const getOrderById = (id) =>
    axios.get(`${API}/${id}`, authHeader());


/* ---------------- ADMIN APIs ---------------- */

// Get all orders (YOU NEED THIS)
export const getAllOrders = () =>
    axios.get(API, authHeader());

// Update order status (logistics)
export const updateOrderStatus = (orderId, status) =>
    axios.put(
        `${API}/${orderId}/status`,
        { status },
        authHeader()
    );

// Update payment status
export const updatePaymentStatus = (orderId, paymentStatus) =>
    axios.put(
        `${API}/${orderId}/payment`,
        { paymentStatus },
        authHeader()
    );

export const getOrderDetailsAdmin = (id) =>
    axios.get(`${API}/admin/${id}`, authHeader());

export const assignDelivery = (orderId, deliveryId) =>
    axios.put(
        `${API}/assign-delivery/${orderId}`,
        { deliveryId },
        authHeader()
    );