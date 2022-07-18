import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';

import GlobalContext from '../../context/GlobalContext';
import NavbarWrapper from './NavbarWrapper.js';
import MessageContainer from '../feedback/Messages';
import Spinner from '../feedback/Spinner';

export default function Layout(props) {
	const { isBodyLoading } = useContext(GlobalContext);
	const messages = props.messages;

	return (
		<>
			<div className='container-fluid navbar-container position-fixed top-0 p-0'>
				<NavbarWrapper/>
			</div>
			
			<div className='body-container p-0'>
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

					<div className='p-0 mt-2'>
						<Outlet />
					</div>
				</>
			</div>
		</>
	)
}