import React from 'react';
import { Outlet } from 'react-router-dom';

import NavbarWrapper from './NavbarWrapper.js';
import MessageContainer from './Messages';

export default function Layout(props) {
	const messages = props.messages;

	return (
		<>
			<NavbarWrapper />

			{messages.successMessages.length > 0 && 
        <MessageContainer messages={messages.successMessages} variant='success' type='success'/>}
      {messages.errorMessages.length > 0 && 
        <MessageContainer messages={messages.errorMessages} variant='danger' type='error'/>}
      {messages.validationMessages.length > 0 && 
        <MessageContainer messages={messages.validationMessages} variant='danger' type='validation'/>}
			
			<Outlet />
		</>
	)
}