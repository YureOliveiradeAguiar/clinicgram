import { useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header/Header.jsx'
import RequireAuth from "@/components/RequireAuth";

import Home from '@/pages/home/Home.jsx'
import Login from '@/pages/login/Login.jsx'
import Dashboard from '@/pages/dashBoard/Dashboard.jsx';
import ClientRegister from '@/pages/clientRegister/ClientRegister.jsx';
import Clients from '@/pages/clients/Clients.jsx';
import Scheduling from '@/pages/scheduling/Scheduling.jsx';
import PlaceManager from '@/pages/placeManager/PlaceManager.jsx';

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
				<Route path='/dashboard' element={<RequireAuth><Dashboard/></RequireAuth>}/>
				<Route path='/clients/new' element={<RequireAuth><ClientRegister/></RequireAuth>}/>
				<Route path='/clients' element={<RequireAuth><Clients/></RequireAuth>}/>
				<Route path='/schedule/new' element={<RequireAuth><Scheduling/></RequireAuth>}/>
				<Route path='/places' element={<RequireAuth><PlaceManager/></RequireAuth>}/>
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