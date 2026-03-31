import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/products`;

const getToken = () => localStorage.getItem("token");

export const getProducts = (params) =>
    axios.get(API, { params });

export const createProduct = (data) =>
    axios.post(API, data, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

export const deleteProduct = (id) =>
    axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });