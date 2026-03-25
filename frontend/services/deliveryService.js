import axios from "axios";

const API = "http://localhost:5000/api/delivery"; 
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