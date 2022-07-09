import React from 'react';
import './index.css';

import { UserProvider } from './context/UserContext';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

import Layout from './components/Layout';
import Login from './components/accounts/Login';
import Settings from './components/accounts/Settings';
import TableSet from './components/TableSet';


const App = () => {
	const [date, setDate] = React.useState(new Date());
	const [user, isUserLoading, error] = useAuthState(auth);
	const [isBodyLoading, setIsBodyLoading] = React.useState(true);
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
			messagesToSet.successMessages.push(newMessages.successMessage);
		}
		if (typeof newMessages.errorMessage !== 'undefined') {
			messagesToSet.errorMessages.push(newMessages.errorMessage);
		}
		if (typeof newMessages.validationMessages !== 'undefined') {
			messagesToSet.validationMessages = newMessages.validationMessages;
		}

		setMessages(messagesToSet)
	}

	React.useEffect(() => {
		if (isUserLoading) return false;
		if (!user) navigate('/login');
	}, [user, isUserLoading]);

	return (
		<UserProvider
			value={{user, isUserLoading, isBodyLoading, setIsBodyLoading, updateMessages, messages}}>
			<div className='container-fluid p-0 m-0 app-container bg-app' >
				<Routes>
					<Route path='/' element={<Layout messages={messages} date={date} onDateFormSubmit={updateDate}/>}>
						<Route path='login' 
							element={<Login status={'login'}/>}
						/>
						<Route path='register' 
							element={<Login status={'register'}/>}
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