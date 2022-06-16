import React from 'react';
import './index.css';

import { Routes, Route, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

import Layout from './components/Layout';
import Login from './components/sessions/Login';
import Register from './components/sessions/Register';
import Log from './components/Log';
import Index from './components/Index';


const App = () => {
	const [status, setStatus] = React.useState('log');
	const [userId, setUserId] = React.useState(1);
	const [date, setDate] = React.useState(new Date());
	const [user, loading, error] = useAuthState(auth);
	const navigate = useNavigate();

	const updateDate = (newDate) => {
		setDate(newDate);
	}

	const updateStatus = (newStatus) => {
		setStatus(newStatus);
	}

	React.useEffect(() => {
		if (loading) return false;
		if (user) navigate('/log');
	}, [user, loading]);

	return (
		<div className='app-container vw-100 vh-100 p-3' >
			<Routes>
				<Route path='/login' element={<Login/>}/>
				<Route path='/register' element={<Register/>}/>
				<Route path='/' element={<Layout onNavigate={updateStatus}/>}>
					<Route path='log' 
						element={<Log status={status} userId={userId} date={date} onNavigate={updateStatus} onDateFormSubmit={updateDate}/>}
					/>
					<Route path='index' 
						element={<Index status={status} userId={userId} onNavigate={updateStatus}/>}
					/>
				</Route>
			</Routes>
    </div>
	)
}

export default App;