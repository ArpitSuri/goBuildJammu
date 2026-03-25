import axios from "axios";

const API = "http://localhost:5000/api/products";

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