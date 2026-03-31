import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/attributes`;

const getToken = () => localStorage.getItem("token");

export const getAttributes = (category) =>
    axios.get(API, { params: { category } });

export const createAttribute = (data) =>
    axios.post(API, data, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

export const updateAttribute = (id, data) =>
    axios.put(`${API}/${id}`, data, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

export const deleteAttribute = (id) =>
    axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });