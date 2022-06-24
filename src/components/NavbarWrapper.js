import { useContext } from 'react';
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { logout } from '../firebase';

import UserContext from '../context/UserContext';


export default function NavbarWrapper()  {
	const { user } = useContext(UserContext);

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
	</>
	)
}