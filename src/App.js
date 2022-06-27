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
import TableSet from './components/TableSet';


const App = () => {
	const [date, setDate] = React.useState(new Date());
	const [user, isUserLoading, error] = useAuthState(auth);
	const [messages, setMessages] = React.useState({successMessages: [], errorMessages: [], validationMessages: []})
	const navigate = useNavigate();

	const updateDate = (newDate) => {
		setDate(newDate);
	}

	const updateMessages = (newMessages, reset=true) => {
		const messagesToSet = reset
			? {successMessages: [], errorMessages: [], validationMessages: []}
			: {...messages};
		
		if (typeof newMessages.successMessage !== 'undefined') {
			messagesToSet.successMessages.push(newMessages.successMessage)
		}
		if (typeof newMessages.errorMessage !== 'undefined') {
			messagesToSet.errorMessages.push(newMessages.errorMessage)
		}
		if (typeof newMessages.validationMessages !== 'undefined') {
			messagesToSet.validationMessages = newMessages.validationMessages
		}

		setMessages(messagesToSet)
	}

	React.useEffect(() => {
		if (isUserLoading) return false;
		if (!user) navigate('/login');
	}, [user, isUserLoading]);

	return (
		<UserProvider
			value={{user, isUserLoading, updateMessages}}>
			<div className='app-container vw-100 vh-100' >
				<Routes>
					<Route path='/' element={<Layout messages={messages} date={date} onDateFormSubmit={updateDate}/>}>
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
							element={<TableSet status={'log'} date={date} onDateFormSubmit={updateDate}/>}
						/>
						<Route path='log/create' 
							element={<TableSet status={'createLog'} date={date} onDateFormSubmit={updateDate}/>}
						/>
						<Route path='index' 
							element={<TableSet status={'index'}/>}
						/>
					</Route>
				</Routes>
			</div>
		</UserProvider>
	)
}

export default App;