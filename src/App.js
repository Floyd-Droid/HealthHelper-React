import React from 'react';
import './index.css';


import Log from './components/Log';
import Index from './components/Index';
import Login from './components/sessions/Login';

import { Routes, Route } from 'react-router-dom';

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
				<Route path='/log' 
					element={<Log status={status} userId={userId} date={date} onNavSubmit={updateStatus} onDateFormSubmit={updateDate}/>}
				/>
				<Route path='/index' 
					element={<Index status={status} userId={userId} onNavSubmit={updateStatus}/>}
				/>
			</Routes>
    </div>
	)
}

export default App;