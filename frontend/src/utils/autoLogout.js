import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getCookie } from "@/utils/csrf.js";

export default function useAutoLogoutIfAuthenticated(redirectPath = "/login") {
	const navigate = useNavigate();

	useEffect(() => {
		const checkAndLogout = async () => {
			try {
				const response = await fetch("/api/check-auth/", {
					method: "GET",
					credentials: "include",
				});
				if (response.ok) {
					await fetch("/api/logout/", {
						method: "POST",
						credentials: "include",
						headers: {
							"Content-Type": "application/json",
							"X-CSRFToken": getCookie("csrftoken"),
						},
					});
					console.log("logged out");
					navigate(redirectPath, { replace: true });
				}
			} catch (err) {
				console.log ("Unable to log out")
			}
		};

		checkAndLogout();
	}, [navigate, redirectPath]);
}
