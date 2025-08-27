import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RequireAuth({ children }) {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("/api/check-auth/", {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    setIsAuthenticated(true);
                } else if (response.status === 403) {
                    navigate("/login", { replace: true });
                } else {
                    console.warn("Unexpected response:", response.status);
                    navigate("/login", { replace: true });
                }
            } catch (error) {
                console.error("Error checking auth:", error);
                navigate("/login", { replace: true });
            } finally {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [navigate]);

    if (isChecking) {
        return <p>Checking authentication...</p>;
    }

    return isAuthenticated ? children : null;
}