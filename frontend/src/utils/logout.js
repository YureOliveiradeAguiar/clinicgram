import { getCookie } from '@/utils/csrf.js';

export default async function handleLogout() {
    try {
        const response = await fetch("api/logout/", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
        });
        if (response.ok) {
            window.location.href = "/";
        } else {
            console.error("Logout failed");
        }
    } catch (error) {
        console.error("Logout error:", error);
    }
};