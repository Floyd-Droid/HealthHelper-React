import React from 'react';
import './index.css';

import { UserProvider } from './context/UserContext';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

import Layout from './components/Layout';
import Login from './components/accounts/Login';
import Register from './components/accounts/Register';
import Settings from './components/accounts/Settings';
import Log from './components/Log';
import Index from './components/Index';


const App = () => {
	const [status, setStatus] = React.useState('log');
	const [date, setDate] = React.useState(new Date());
	const [user, isLoading, error] = useAuthState(auth);
	const navigate = useNavigate();

	const updateDate = (newDate) => {
		setDate(newDate);
	}

	const updateStatus = (newStatus) => {
		setStatus(newStatus);
	}

	React.useEffect(() => {
		if (isLoading) return false;
		if (!user) navigate('/login');
	}, [user, isLoading]);

	return (
		<UserProvider
			value={{user, isLoading}}>
			<div className='app-container vw-100 vh-100 p-3' >
				<Routes>
					<Route path='/login' element={<Login/>}/>
					<Route path='/register' element={<Register/>}/>
					<Route path='/' element={<Layout onNavigate={updateStatus}/>}>
						<Route path='log' 
							element={<Log status={status} date={date} onNavigate={updateStatus} onDateFormSubmit={updateDate}/>}
						/>
						<Route path='index' 
							element={<Index status={status} onNavigate={updateStatus}/>}
						/>
						<Route path='accounts/settings' 
							element={<Settings user={user}/>}
						/>
					</Route>
				</Routes>
			</div>
		</UserProvider>
	)
}

export default App;