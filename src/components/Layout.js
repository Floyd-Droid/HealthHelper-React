import React from 'react';
import { Outlet } from 'react-router-dom';

import NavbarWrapper from './NavbarWrapper.js';
import MessageContainer from './Messages';

export default function Layout(props) {
	const messages = props.messages;

	return (
		<>
			<div className='container-fluid navbar-container position-fixed top-0 p-0'>
				<NavbarWrapper date={props.date} onDateFormSubmit={props.onDateFormSubmit}/>
			</div>
			
			<div className='body-container'>
				<div className='container d-flex justify-content-center w-50'>
					<div className='container px-0'>
						{messages.successMessages.length > 0 && 
							<MessageContainer messages={messages.successMessages} variant='success' type='success'/>}
						{messages.errorMessages.length > 0 && 
							<MessageContainer messages={messages.errorMessages} variant='danger' type='error'/>}
						{messages.validationMessages.length > 0 && 
							<MessageContainer messages={messages.validationMessages} variant='danger' type='validation'/>}
					</div>
				</div>

				<div>
					<Outlet />
				</div>
			</div>
		</>
	)
}