import { useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx';

function Layout() {
	const location = useLocation();
  	const path = location.pathname;
  	const isLoginPage = path === '/login';
  	const isHomePage = path === '/';
	
	return (
		<>
			{/* && is not AND conditional, its a React property of condition rendering*/}
			{/* its structure: '(condition) && (component)'*/}
			{!isLoginPage && (<Header showNavbar={isHomePage} />)}
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path='/dashboard' element={<Dashboard/>} />
			</Routes>
		</>
	);
}

export default function App () {
	return (
    	<Router>
    		<Layout />
    	</Router>
  	);
}