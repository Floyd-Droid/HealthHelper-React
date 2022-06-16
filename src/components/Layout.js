import { Outlet, Link } from 'react-router-dom';
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';
import { logout } from '../firebase';

export default function Layout(props) {

	const handleNavigate = (e) => {
		props.onNavigate(e.target.attributes.status.value);
	}

	return (
		<>
			<Navbar bg="light" expand="lg">
				<Container>
					<Navbar.Brand href="">HealthHelper</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="me-auto">
							<Link to='log' className='nav-link' onClick={handleNavigate} status='log'>Log</Link>
							<Link to='index' className='nav-link' onClick={handleNavigate} status='index'>Index</Link>
							<NavDropdown title="User" id="basic-nav-dropdown">
								<NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
								<NavDropdown.Item href="/login" onClick={logout}>Log out</NavDropdown.Item>
							</NavDropdown>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>

			<Outlet />
		</>
	)
}