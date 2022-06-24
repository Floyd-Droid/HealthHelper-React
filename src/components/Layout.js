import React, { useContext } from 'react';

import UserContext from '../context/UserContext';
import { Outlet, Link } from 'react-router-dom';
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';
import { logout } from '../firebase';
import MessageContainer from './Messages';

export default function Layout(props) {
	const { user, isLoading } = useContext(UserContext);
	const messages = props.messages;

	React.useEffect(() => {
		if (isLoading) {
			return false;
		}
	}, [isLoading])

	return (
		<>
			<Navbar bg="light" expand="lg">
				<Container>
					<Navbar.Brand href="">HealthHelper</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="me-auto">
							<Link to='/log' className='nav-link'>Log</Link>
							<Link to='/index' className='nav-link'>Index</Link>
							<NavDropdown title={user ? user.displayName : 'User'} id="basic-nav-dropdown">
								<NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
								<NavDropdown.Item href="/login" onClick={logout}>Log out</NavDropdown.Item>
							</NavDropdown>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>

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