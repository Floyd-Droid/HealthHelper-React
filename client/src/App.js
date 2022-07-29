import React from 'react';

import { GlobalProvider } from './context/GlobalContext';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

import Layout from './components/layout/Layout';
import Login from './components/accounts/Login';
import Settings from './components/accounts/Settings';
import TableSet from './components/table/TableSet';
import NotFoundPage from './components/pages/NotFoundPage';


const App = () => {
	const [date, setDate] = React.useState(new Date());
	const [user, isUserLoading, error] = useAuthState(auth);
	const [isBodyLoading, setIsBodyLoading] = React.useState(true);
	const [messages, setMessages] = React.useState({successMessages: [], errorMessages: [], validationMessages: []});
	const [isRedirecting, setIsRedirecting] = React.useState(false);
	const navigate = useNavigate();

	const updateDate = (newDate) => {
		setDate(newDate);
	}

	const updateMessages = (...newMessages) => {
		const messagesToSet = {successMessages: [], errorMessages: [], validationMessages: []};

		for (const messageSet of newMessages) {
			if (typeof messageSet.successMessage !== 'undefined') {
				messagesToSet.successMessages.push(messageSet.successMessage);
			}
			if (typeof messageSet.errorMessage !== 'undefined') {
				messagesToSet.errorMessages.push(messageSet.errorMessage);
			}
			if (typeof messageSet.validationMessages !== 'undefined') {
				messagesToSet.validationMessages = messageSet.validationMessages;
			}
		}

		setMessages(messagesToSet);
	}

	React.useEffect(() => {
		if (isBodyLoading && !user && !isUserLoading && !isRedirecting) {
			navigate('/');
			setIsBodyLoading(false);
		}
	}, [isBodyLoading, user, isUserLoading]);

	React.useEffect(() => {
		if (!isBodyLoading && isRedirecting) {
			setIsRedirecting(false);
		}
	}, [isBodyLoading]);

	return (
		<GlobalProvider
			value={{user, isUserLoading, isBodyLoading, setIsBodyLoading, date, updateDate, messages, updateMessages, setIsRedirecting}}>
			<Routes>
				<Route path='/' element={<Layout messages={messages}/>}>
					<Route path='' 
						element={<Login status={'login'}/>}
					/>
					<Route path='register' 
						element={<Login status={'register'}/>}
					/>
					<Route path='settings' 
						element={<Settings/>}
					/>
					<Route path='log' 
						element={<TableSet status={'log'}/>}
					/>
					<Route path='log/create' 
						element={<TableSet status={'createLog'}/>}
					/>
					<Route path='index' 
						element={<TableSet status={'index'}/>}
					/>
					<Route path='*' element={<NotFoundPage />}/>
				</Route>
			</Routes>
		</GlobalProvider>
	)
}

export default App;
