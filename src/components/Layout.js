import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import UserContext from '../context/UserContext';

import NavbarWrapper from './NavbarWrapper.js';
import MessageContainer from './Messages';
import Spinner from './Spinner';

export default function Layout(props) {
	const { isBodyLoading } = useContext(UserContext)
	const messages = props.messages;

	return (
		<>
			<div className='container-fluid navbar-container position-fixed top-0 p-0'>
				<NavbarWrapper date={props.date} onDateFormSubmit={props.onDateFormSubmit}/>
			</div>
			
			<div className='container-fluid body-container p-0'>
				{isBodyLoading &&
					<div className='container spinner-container d-flex justify-content-center align-items-center vh-100'>
						<Spinner />
					</div>
				}
				<>
					<div className='d-flex justify-content-center px-1'>
							<div className='message-container mt-2'>
								{messages.successMessages.length > 0 && 
									<MessageContainer messages={messages.successMessages} variant='success' type='success'/>}
								{messages.errorMessages.length > 0 && 
									<MessageContainer messages={messages.errorMessages} variant='danger' type='error'/>}
								{messages.validationMessages.length > 0 && 
									<MessageContainer messages={messages.validationMessages} variant='warning' type='validation'/>}
							</div>
						</div>

					<div className='container-fluid p-0 mt-2'>
						<Outlet />
					</div>
				</>
			</div>
		</>
	)
}