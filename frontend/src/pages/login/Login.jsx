import LoginForm from './LoginForm/LoginForm.jsx'

import useAutoLogoutIfAuthenticated from "@/utils/autoLogout.js";

function Login() {

	useAutoLogoutIfAuthenticated()

	return(
        <main style={{ paddingBottom: '15vh', justifyContent: 'center' }}>
			<LoginForm/>
		</main>
	);
}

export default Login