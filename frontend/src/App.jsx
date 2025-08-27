import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RequireAuth from "@/hooks/RequireAuth.jsx";
import Layout from './components/Layout/Layout.jsx';

import Home from '@/pages/home/Home.jsx'
import Login from '@/pages/login/Login.jsx'
import Dashboard from '@/pages/dashBoard/Dashboard.jsx';
import Staff from './pages/staff/Staff.jsx';
import Clients from '@/pages/clients/Clients.jsx';
import Scheduling from '@/pages/scheduling/Scheduling.jsx';
import Schedule from '@/pages/schedule/Schedule.jsx';
import Places from '@/pages/places/Places.jsx';
import History from '@/pages/history/History.jsx';


export default function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route element={<Layout />}>
						<Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
						<Route path="/staff" element={<RequireAuth><Staff /></RequireAuth>} />
						<Route path="/clients" element={<RequireAuth><Clients /></RequireAuth>} />
						<Route path="/schedule/new" element={<RequireAuth><Scheduling /></RequireAuth>} />
						<Route path="/schedule" element={<RequireAuth><Schedule /></RequireAuth>} />
						<Route path="/places" element={<RequireAuth><Places /></RequireAuth>} />
						<Route path="/history" element={<RequireAuth><History /></RequireAuth>} />
					</Route>
				</Routes>
			</Router>
		</>
	);
}