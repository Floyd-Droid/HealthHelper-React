import React from 'react';
import './index.css';

import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Log from './components/Log';
import Index from './components/Index';
import Login from './components/sessions/Login';


const App = () => {
	const [status, setStatus] = React.useState('log');
	const [userId, setUserId] = React.useState(1);
	const [date, setDate] = React.useState(new Date());

	const updateDate = (newDate) => {
		setDate(newDate);
	}

	const updateStatus = (newStatus) => {
		setStatus(newStatus);
	}

	return (
		<div className='app-container vw-100 vh-100 p-3' >
			<Routes>
				<Route path='/login' element={<Login/>}/>
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