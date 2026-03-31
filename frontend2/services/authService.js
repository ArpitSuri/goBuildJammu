import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/auth`;

export const sendSignupOTP = (data) =>
    axios.post(`${API}/signup`, data);

export const sendLoginOTP = (data) =>
    axios.post(`${API}/login`, data);

export const verifyOTP = (data) =>
    axios.post(`${API}/verify-otp`, data);