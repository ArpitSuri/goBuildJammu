import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/categories`;

const getToken = () => localStorage.getItem("token");

export const getCategories = () =>
    axios.get(API);

export const createCategory = (data) =>
    axios.post(API, data, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

export const updateCategory = (id, data) =>
    axios.put(`${API}/${id}`, data, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

export const deleteCategory = (id) =>
    axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });