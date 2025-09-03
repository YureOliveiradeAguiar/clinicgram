import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RequireAuth from "@/hooks/RequireAuth.jsx";
import Layout from './components/Layout/Layout.jsx';

import Home from '@/pages/home/Home.jsx'
import Login from '@/pages/login/Login.jsx'
import Dashboard from '@/pages/dashBoard/Dashboard.jsx';
import Workers from './pages/workers/Workers.jsx';
import Clients from '@/pages/clients/Clients.jsx';
import Scheduling from '@/pages/scheduling/Scheduling.jsx';
import Schedule from '@/pages/schedule/Schedule.jsx';
import Places from '@/pages/places/Places.jsx';
import Appointments from '@/pages/Appointments/Appointments.jsx';
import History from '@/pages/history/History.jsx';


export default function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route element={<Layout />}>
						<Route path="/dashboard" element={<RequireAuth><Dashboard/></RequireAuth>}/>

						<Route path="/workers" element={<RequireAuth><Workers/></RequireAuth>}/>
						<Route path="/clients" element={<RequireAuth><Clients/></RequireAuth>}/>
						<Route path="/places" element={<RequireAuth><Places /></RequireAuth>}/>
						<Route path="/appointments" element={<RequireAuth><Appointments/></RequireAuth>}/>
						<Route path="/history" element={<RequireAuth><History /></RequireAuth>}/>

						<Route path="/schedule/new" element={<RequireAuth><Scheduling/></RequireAuth>}/>
						<Route path="/schedule" element={<RequireAuth><Schedule /></RequireAuth>}/>
					</Route>
				</Routes>
			</Router>
		</>
	);
}