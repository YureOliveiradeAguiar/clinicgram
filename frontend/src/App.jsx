import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RequireAuth from "@/hooks/RequireAuth.jsx";
import Layout from './components/Layout/Layout.jsx';

import Home from '@/pages/home/Home.jsx'
import Login from '@/pages/login/Login.jsx'
import Dashboard from '@/pages/dashBoard/Dashboard.jsx';
import Workers from './pages/workers/Workers.jsx';
import Clients from '@/pages/clients/Clients.jsx';
import Schedule from '@/pages/schedule/Schedule.jsx';
import Places from '@/pages/places/Places.jsx';
import Appointments from '@/pages/appointments/Appointments.jsx';
import History from '@/pages/history/History.jsx';
import Treatments from '@/pages/treatments/Treatments.jsx';


export default function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route element={<Layout />}>
						<Route path="/dashboard" element={<RequireAuth><Dashboard/></RequireAuth>}/>

						<Route path="/appointments" element={<RequireAuth><Appointments/></RequireAuth>}/>
						<Route path="/schedule" element={<RequireAuth><Schedule /></RequireAuth>}/>

						<Route path="/clients" element={<RequireAuth><Clients/></RequireAuth>}/>
						<Route path="/workers" element={<RequireAuth><Workers/></RequireAuth>}/>
						<Route path="/places" element={<RequireAuth><Places/></RequireAuth>}/>
						<Route path="/treatments" element={<RequireAuth><Treatments/></RequireAuth>}/>
						<Route path="/history" element={<RequireAuth><History/></RequireAuth>}/>
					</Route>
				</Routes>
			</Router>
		</>
	);
}