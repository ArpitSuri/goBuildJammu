import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/delivery`;
const getToken = () => localStorage.getItem("token");


export const createDelivery = (data) =>
    axios.post(`${API}`, data, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

export const getDelivery = () =>
    axios.get(`${API}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

export const updateDelivery = (id, data) =>
    axios.put(`${API}/${id}`, data, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

export const deleteDelivery = (id) =>
    axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

export const getMyDeliveryOrders = () =>
    axios.get(`${API}/my-orders`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

export const getDeliveryOrderById = (orderId) =>
    axios.get(`${API}/order/${orderId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

export const updateDeliveryStatus = (orderId, status) =>
    axios.put(
        `${API}/order/${orderId}/status`,
        { status },
        {
            headers: { Authorization: `Bearer ${getToken()}` }
        }
    );