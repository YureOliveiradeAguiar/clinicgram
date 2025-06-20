import { useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header/Header.jsx'

import Home from '@/pages/home/Home.jsx'
import Login from '@/pages/login/Login.jsx'
import Dashboard from '@/pages/dashBoard/Dashboard.jsx';
import ClientRegister from '@/pages/clientRegister/ClientRegister.jsx';
import Clients from '@/pages/clients/Clients.jsx';

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
				<Route path="/" element={<Home/>}/>
				<Route path="/login" element={<Login/>}/>
				<Route path='/dashboard' element={<Dashboard/>}/>
				<Route path='/clients/new' element={<ClientRegister/>}/>
				<Route path='/clients' element={<Clients/>}/>
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