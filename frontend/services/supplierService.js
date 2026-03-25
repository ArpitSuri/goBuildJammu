import axios from "axios";
const API = "http://localhost:5000/api/suppliers";
const getToken = () => localStorage.getItem("token");


export const createSupplier = (data) =>
    axios.post(`${API}`, data, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

export const getSuppliers = () =>
    axios.get(`${API}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

export const updateSupplier = (id, data) =>
    axios.put(`${API}/${id}`, data, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

export const deleteSupplier = (id) =>
    axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });