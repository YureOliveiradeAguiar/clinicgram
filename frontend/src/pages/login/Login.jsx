import LoginForm from './LoginForm/LoginForm.jsx'

import handleLogout from '@/utils/logout.js'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
	const navigate = useNavigate();
	useEffect(() => {
		const logoutAndProceed = async () => {
			await handleLogout();
			navigate("/login", { replace: true }); // Force refresh state.
		};

		logoutAndProceed();
	}, []);

	return(
        <main style={{ paddingBottom: '15vh', justifyContent: 'center' }}>
			<LoginForm/>
		</main>
	);
}

export default Login