import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const sendSignupOTP = (data) =>
    axios.post(`${API}/signup`, data);

export const sendLoginOTP = (data) =>
    axios.post(`${API}/login`, data);

export const verifyOTP = (data) =>
    axios.post(`${API}/verify-otp`, data);