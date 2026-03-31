import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [delivery, setDelivery] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchMyProfile = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            setUser(data.user);
            setDelivery(data.delivery);
        } catch (err) {
            setUser(null);
            setDelivery(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyProfile();
    }, []);

    return (
        <AuthContext.Provider value={{ user, delivery, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);