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
	const [date, setDate] = React.useState(new Date());
	const [user, isLoading, error] = useAuthState(auth);
	const navigate = useNavigate();

	const updateDate = (newDate) => {
		setDate(newDate);
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
					<Route path='/' element={<Layout/>}>
						<Route path='login' 
							element={<Login/>}
						/>
						<Route path='register' 
							element={<Register/>}
						/>
						<Route path='settings' 
							element={<Settings/>}
						/>
						<Route path='log' 
							element={<Log status={'log'} date={date} onDateFormSubmit={updateDate}/>}
						/>
						<Route path='log/create' 
							element={<Log status={'createLog'} date={date} onDateFormSubmit={updateDate}/>}
						/>
						<Route path='index' 
							element={<Index status={'index'}/>}
						/>
					</Route>
				</Routes>
			</div>
		</UserProvider>
	)
}

export default App;