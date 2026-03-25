import { jwtDecode } from "jwt-decode";

export const getUserRole = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.log("No token found in localStorage");
        return null;
    }

    try {
        const decoded = jwtDecode(token);

        // Check if role exists
        if (decoded && decoded.role) {
            // If it's an array, return the first element
            if (Array.isArray(decoded.role)) {
                return decoded.role[0];
            }
            // If it's already a string, just return it
            return decoded.role;
        }

        return null;
    } catch (error) {
        console.error("Invalid Token:", error);
        return null;
    }
};