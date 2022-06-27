import { useContext } from 'react';
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';
import { logout } from '../firebase';

import UserContext from '../context/UserContext';
import DateForm from './DateForm';

export default function NavbarWrapper(props)  {
	const { user } = useContext(UserContext);
	const location = window.location;

 	return (
		<Navbar className='h-100' bg='dark' variant='dark' expand="sm" >
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Container fluid className='d-flex justify-content-between align-items-center p-0'>
					<Container fluid className='d-flex align-items-center'>
						<Nav activeKey={location.pathname}>
							<Nav.Link href="/" className='d-flex justify-content-center align-items-center me-5'>
								<svg className='mx-2' height="44" viewBox="0 0 64 64" width="44" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="m19.1821589 8c-8.9371596 0-16.1821589 4.3893242-16.1821589 16.1821589 0 11.7928346 29.0326968 33.283923 29.0326968 33.283923s29.0326967-21.4910884 29.0326967-33.283923c0-11.7928347-7.2449993-16.1821589-16.1821588-16.1821589-5.2369705 0-9.8929055 2.487709-12.8505379 6.3458602-2.9576325-3.8581512-7.6135674-6.3458602-12.8505379-6.3458602z" fill="#e43535"/><path d="m8 37.395h11.786l2.792-9.197 3.285 13.911 3.769-24.109 3.917 30.143 4.342-25.133 2.562 14.844h20.993" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></g></svg>
								<span className='brand mx-1'>HealthHelper</span>
							</Nav.Link>
							<Nav.Link href="/log" className='d-flex justify-content-center align-items-center'>
								<svg height="20" viewBox="0 0 64 64" width="20" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="m-15.5 36.5c0-2.7614237 2.2352889-5 5.0075552-5h41.9924448v10h-47z" fill="#6b6b6b" transform="matrix(0 -1 1 0 -28.5 44.5)"/><path d="m10 18h33v42h-33z" fill="#ed9111"/><path d="m3 13c0-2.7614237 2.23520515-5 5.00691225-5h32.99308775v10h-32.99308775c-2.76524128 0-5.00691225-2.2441952-5.00691225-5z" fill="#d0d0d0"/><path d="m8 14h30c.5522847 0 1-.4477153 1-1s-.4477153-1-1-1h-30c-.55228475 0-1 .4477153-1 1s.44771525 1 1 1z" fill="#989898" fill-rule="nonzero"/><path d="m49 20h9v34.5071706c0 2.4813212-2.0197757 4.4928294-4.5 4.4928294-2.4852814 0-4.5-2.0146851-4.5-4.4928294z" fill="#957f62"/><g transform="translate(49 10)"><path d="m4.5 0 4.5 10h-9z" fill="#d3b288"/><path d="m6.75 5-2.25-5-2.25 5z" fill="#957f62"/></g><path d="m52 20v38c0 .5522847.4477153 1 1 1s1-.4477153 1-1v-38c0-.5522847-.4477153-1-1-1s-1 .4477153-1 1z" fill="#d2b288" fill-rule="nonzero"/></g></svg>
								<span className='mx-1'>Log</span>
							</Nav.Link>
							<Nav.Link href="/index" className='d-flex justify-content-center align-items-center'>
								<svg height="20" viewBox="0 0 64 64" width="20" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="m28 55.779h8v5h-8z" fill="#595959"/><path d="m31.9804928 16.620603s-2.9182879-7.82290274 7.3264523-13.620603" stroke="#bd7575" stroke-linecap="round" stroke-width="2"/><path d="m21.8952051 62.0138375c2.6526141 0 9.8126954-1.8841817 11.7183372-5.0563118 4.839315-8.0555205 2.3864577-23.442125 2.3864577-30.1783516 0-9.3888408-7.6111593-17.00000005-17-17.00000005-9.38884075 0-17 7.61115925-17 17.00000005 0 9.3888407 10.5063644 35.2346634 19.8952051 35.2346634z" fill="#e43535"/><path d="m32 58.9090513c2.9279169 1.9779377 7.6750173 3.1047862 9.7263941 3.1047862 9.3888408 0 19.8952052-25.8458227 19.8952052-35.2346634 0-9.3888408-7.6111593-17.00000005-17-17.00000005-5.0081163 0-9.5104327 2.16558725-12.6215993 5.61141195z" fill="#ffdd95"/><path d="m20.5 14.7791741c-7.4558441 0-13.5 6.0441558-13.5 13.5" stroke="#ff78c7" stroke-linecap="round" stroke-width="2"/><g fill="#bd7575"><path d="m36.8890873 35.3890873c1.1045695 0 2-2.5670034 2-4.5s-.8954305-2.5-2-2.5-2 .5670034-2 2.5.8954305 4.5 2 4.5z" transform="matrix(.70710678 .70710678 -.70710678 .70710678 33.354466 -16.744804)"/><path d="m36.0273043 40.8366622c.8870199 0 1.6060916-2.0614212 1.6060916-3.613706 0-1.5522847-.7190717-2.0076144-1.6060916-2.0076144-.8870198 0-1.6060915.4553297-1.6060915 2.0076144 0 1.5522848.7190717 3.613706 1.6060915 3.613706z" transform="matrix(-.15643447 .98768834 -.98768834 -.15643447 79.220701 8.391129)"/></g></g></svg>
								<span className='mx-1'>Index</span>
							</Nav.Link>
						</Nav>
					</Container>
					<Container fluid className='d-flex justify-content-center align-items-center'>
						<Nav>
							<DateForm 
								date={props.date}
								onDateFormSubmit={props.onDateFormSubmit}
							/>
						</Nav>
					</Container>
					<Container fluid className='d-flex justify-content-end align-items-center'>
						<Nav>
							<NavDropdown className='me-3' title={user ? user.displayName : 'User'} id="basic-nav-dropdown">
								<NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
								<NavDropdown.Item href="/login" onClick={logout}>Log out</NavDropdown.Item>
							</NavDropdown>
						</Nav>
					</Container>
				</Container>
			</Navbar.Collapse>
		</Navbar>
	)
}