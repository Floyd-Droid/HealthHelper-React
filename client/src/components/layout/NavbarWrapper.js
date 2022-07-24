import { useContext } from 'react';
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { logout } from '../../firebase';

import GlobalContext from '../../context/GlobalContext';
import DateForm from './DateForm';

export default function NavbarWrapper()  {
	const { user, isUserLoading, setIsBodyLoading, updateMessages } = useContext(GlobalContext);
	const location = window.location;

	const navigate = (e) => {
		const currentLocation = window.location.href;
		const nextLocation = e.target.closest('a').href;

		if (nextLocation !== currentLocation) {
			setIsBodyLoading(true);
			updateMessages({});
		}
	}

	const navLogout = () => {
		setIsBodyLoading(true);
		logout();
	}

 	return (
		<Navbar className='bg-navbar-container h-100'  variant='dark' expand="sm" >
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Container fluid className='d-flex justify-content-between align-items-center p-0'>
					<Container fluid className='d-flex align-items-center'>
						<Nav activeKey={location.pathname}>
							
							<Nav.Link className='d-flex justify-content-center align-items-center me-5 text-white disabled'>
								<svg className='mx-2' height="44" viewBox="0 0 64 64" width="44" xmlns="http://www.w3.org/2000/svg">
									<g fill="none" fillRule="evenodd">
										<path d="m19.1821589 8c-8.9371596 0-16.1821589 4.3893242-16.1821589 16.1821589 0 11.7928346 29.0326968 33.283923 29.0326968 33.283923s29.0326967-21.4910884 29.0326967-33.283923c0-11.7928347-7.2449993-16.1821589-16.1821588-16.1821589-5.2369705 0-9.8929055 2.487709-12.8505379 6.3458602-2.9576325-3.8581512-7.6135674-6.3458602-12.8505379-6.3458602z" fill="#e43535"/>
										<path d="m8 37.395h11.786l2.792-9.197 3.285 13.911 3.769-24.109 3.917 30.143 4.342-25.133 2.562 14.844h20.993" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
									</g>
								</svg>
								<span className='brand mx-1'>HealthHelper</span>
							</Nav.Link>

							<Link to='/log' className={`nav-link d-flex justify-content-center align-items-center ${(location.pathname === '/log') ? 'active' : 'inactive'}`}
								onClick={navigate}>
							<svg height='20' width='20' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
									<path fill="#66757F" d="M28.815 4h1.996v1h-1.996z"/>
									<path fill="#CCD6DD" d="M2 12v20c0 2.209 1.791 4 4 4h24c2.209 0 4-1.791 4-4V12H2z"/>
									<path fill="#DD2E44" d="M30 4H6C3.791 4 2 5.791 2 8v5h32V8c0-2.209-1.791-4-4-4z"/>
									<path d="M8.836 8.731c-.702 0-1.271-.666-1.271-1.489 0-.822.569-1.489 1.271-1.489.701 0 1.27.667 1.27 1.489 0 .822-.569 1.489-1.27 1.489zm6 0c-.702 0-1.271-.666-1.271-1.489 0-.822.569-1.489 1.271-1.489.701 0 1.27.667 1.27 1.489 0 .822-.569 1.489-1.27 1.489zm6 0c-.702 0-1.271-.666-1.271-1.489 0-.822.569-1.489 1.271-1.489.701 0 1.271.667 1.271 1.489-.001.822-.57 1.489-1.271 1.489zm6 0c-.702 0-1.271-.666-1.271-1.489 0-.822.569-1.489 1.271-1.489.701 0 1.271.667 1.271 1.489-.001.822-.57 1.489-1.271 1.489z" fill="#292F33"/>
									<path fill="#66757F" d="M27.315.179c-1.277 0-2.383.802-2.994 1.97-.606-1.143-1.717-1.97-3.006-1.97-1.277 0-2.383.802-2.994 1.97-.606-1.143-1.717-1.97-3.006-1.97-1.277 0-2.383.802-2.994 1.97-.606-1.143-1.717-1.97-3.006-1.97-1.934 0-3.5 1.819-3.5 4.005 0 1.854 1.045 3.371 2.569 3.926.759.275 1.224-.447 1.159-1.026-.055-.48-.374-.793-.729-1.018-.485-.307-1-1.008-1-1.877 0-1.104.671-2.095 1.5-2.095s1.5.905 1.5 1.905h1.016c-.003.062-.016.121-.016.184 0 1.854 1.045 3.371 2.569 3.926.759.275 1.224-.447 1.159-1.026-.055-.479-.374-.792-.729-1.017-.485-.307-1-1.008-1-1.877 0-1.104.671-2.095 1.5-2.095S16.815 3 16.815 4h1.016c-.003.062-.016.121-.016.184 0 1.854 1.045 3.371 2.569 3.926.759.275 1.224-.447 1.159-1.026-.055-.479-.374-.792-.729-1.017-.485-.307-1-1.008-1-1.877 0-1.104.671-2.095 1.5-2.095S22.815 3 22.815 4h1.016c-.003.062-.016.121-.016.184 0 1.854 1.045 3.371 2.569 3.926.759.275 1.224-.447 1.159-1.026-.055-.479-.374-.792-.729-1.017-.485-.307-1-1.008-1-1.877 0-1.104.671-2.095 1.5-2.095S28.815 3 28.815 4h1.996C30.79 2 29.235.179 27.315.179z"/>
									<path d="M11 15h4v4h-4zm5 0h4v4h-4zm5 0h4v4h-4zm5 0h4v4h-4zM6 20h4v4H6zm5 0h4v4h-4zm5 0h4v4h-4zm5 0h4v4h-4zm5 0h4v4h-4zM6 25h4v4H6zm5 0h4v4h-4zm5 0h4v4h-4zm5 0h4v4h-4zm5 0h4v4h-4zM6 30h4v4H6zm5 0h4v4h-4zm5 0h4v4h-4z" fill="#FFF"/></svg>
								<span className='mx-1'>Log</span>
							</Link>

							<Link to='/log/create' className={`nav-link d-flex justify-content-center align-items-center ${(location.pathname === '/log/create') ? 'active' : 'inactive'}`} 
								onClick={navigate}>
							<svg height="20" viewBox="0 0 64 64" width="20" xmlns="http://www.w3.org/2000/svg">
									<g fill="none" fillRule="evenodd">
										<path d="m24.7228694.96294543h11.9246212l.0102509 51.32721297c.0005513 2.7606143-2.2419318 4.9985343-5.0042839 4.9985343h-1.9140569c-2.764341 0-5.00573-2.2427944-5.0062804-4.9985343z" fill="#6b6b6b" transform="matrix(-.70710678 .70710678 -.70710678 -.70710678 72.986299 28.020085)"/>
										<g transform="matrix(-.70710678 .70710678 -.70710678 -.70710678 63.99984 54.010398)">
											<path d="m5.962 0 5.963 13h-11.925z" fill="#d3b288"/>
											<path d="m8.81594408 6.22195616-2.85363348-6.22195616-2.85363347 6.22195616z" fill="#6b6b6b"/>
										</g>
										<g fillRule="nonzero"><path d="m50.3593885 46.682242-34.2708152-34.2708153c-.3905243-.3905243-1.0236893-.3905243-1.4142136 0s-.3905243 1.0236893 0 1.4142136l34.2708153 34.2708153c.3905243.3905243 1.0236892.3905243 1.4142135 0s.3905243-1.0236893 0-1.4142136z" fill="#a8a8a8"/>
											<path d="m52.5271058 58h-4c-.5522847 0-1 .4477153-1 1s.4477153 1 1 1h4c.5522848 0 1-.4477153 1-1s-.4477152-1-1-1zm-8 0h-4c-.5522847 0-1 .4477153-1 1s.4477153 1 1 1h4c.5522848 0 1-.4477153 1-1s-.4477152-1-1-1zm-8 0h-4c-.5522847 0-1 .4477153-1 1s.4477153 1 1 1h4c.5522848 0 1-.4477153 1-1s-.4477152-1-1-1zm-8 0h-4c-.5522847 0-1 .4477153-1 1s.4477153 1 1 1h4c.5522848 0 1-.4477153 1-1s-.4477152-1-1-1zm-8 0h-4c-.5522847 0-1 .4477153-1 1s.4477153 1 1 1h4c.5522848 0 1-.4477153 1-1s-.4477152-1-1-1zm-8 0h-3.99999996c-.55228475 0-1 .4477153-1 1s.44771525 1 1 1h3.99999996c.5522848 0 1-.4477153 1-1s-.4477152-1-1-1zm19.4728942-12h-17c-.5522847 0-1 .4477153-1 1s.4477153 1 1 1h17c.5522847 0 1-.4477153 1-1s-.4477153-1-1-1z" fill="#979797"/>
										</g>
									</g>
								</svg>
								<span className='mx-1 text-nowrap'>Log +</span>
							</Link>

							<Link to='/index' className={`nav-link d-flex justify-content-center align-items-center ${(location.pathname === '/index') ? 'active' : 'inactive'}`} 
								onClick={navigate}>
								<svg height="20" viewBox="0 0 64 64" width="20" xmlns="http://www.w3.org/2000/svg">
										<g fill="none" fillRule="evenodd">
											<path d="m28 55.779h8v5h-8z" fill="#595959"/>
											<path d="m31.9804928 16.620603s-2.9182879-7.82290274 7.3264523-13.620603" stroke="#bd7575" strokeLinecap="round" strokeWidth="2"/>
											<path d="m21.8952051 62.0138375c2.6526141 0 9.8126954-1.8841817 11.7183372-5.0563118 4.839315-8.0555205 2.3864577-23.442125 2.3864577-30.1783516 0-9.3888408-7.6111593-17.00000005-17-17.00000005-9.38884075 0-17 7.61115925-17 17.00000005 0 9.3888407 10.5063644 35.2346634 19.8952051 35.2346634z" fill="#e43535"/>
											<path d="m32 58.9090513c2.9279169 1.9779377 7.6750173 3.1047862 9.7263941 3.1047862 9.3888408 0 19.8952052-25.8458227 19.8952052-35.2346634 0-9.3888408-7.6111593-17.00000005-17-17.00000005-5.0081163 0-9.5104327 2.16558725-12.6215993 5.61141195z" fill="#ffdd95"/>
											<path d="m20.5 14.7791741c-7.4558441 0-13.5 6.0441558-13.5 13.5" stroke="#ff78c7" strokeLinecap="round" strokeWidth="2"/>
											<g fill="#bd7575">
												<path d="m36.8890873 35.3890873c1.1045695 0 2-2.5670034 2-4.5s-.8954305-2.5-2-2.5-2 .5670034-2 2.5.8954305 4.5 2 4.5z" transform="matrix(.70710678 .70710678 -.70710678 .70710678 33.354466 -16.744804)"/>
												<path d="m36.0273043 40.8366622c.8870199 0 1.6060916-2.0614212 1.6060916-3.613706 0-1.5522847-.7190717-2.0076144-1.6060916-2.0076144-.8870198 0-1.6060915.4553297-1.6060915 2.0076144 0 1.5522848.7190717 3.613706 1.6060915 3.613706z" transform="matrix(-.15643447 .98768834 -.98768834 -.15643447 79.220701 8.391129)"/>
											</g>
										</g>
									</svg>
									<span className='mx-1'>Index</span>
							</Link>
						</Nav>
					</Container>
					<Container fluid className='d-flex justify-content-center align-items-center'>
						<Nav>
							<DateForm/>
						</Nav>
					</Container>
					<Container fluid className='d-flex justify-content-end align-items-center'>
						<Nav>
							{!isUserLoading &&
								<Container fluid className='d-flex justify-content-end align-items-center  p-0 m-0'>
									<svg width="22" height="22" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M60 70L20 70C17.7909 70 16 68.2091 16 66C16 59.3836 20.1048 53.4615 26.3003 51.1395L27.5304 50.6785C35.5704 47.6651 44.4296 47.6651 52.4696 50.6785L53.6997 51.1395C59.8952 53.4615 64 59.3836 64 66C64 68.2091 62.2091 70 60 70Z" fill="#F59D38" stroke="#F59D38" strokeWidth="4" strokeLinecap="square" strokeLinejoin="round" />
										<path d="M33.9015 38.8673C37.7294 40.8336 42.2706 40.8336 46.0985 38.8673C49.6611 37.0373 52.2136 33.7042 53.0516 29.7878L53.2752 28.7425C54.1322 24.7375 53.2168 20.5576 50.7644 17.2774L50.4053 16.797C47.9525 13.5163 44.0962 11.5845 40 11.5845C35.9038 11.5845 32.0475 13.5163 29.5947 16.797L29.2356 17.2774C26.7832 20.5576 25.8678 24.7375 26.7248 28.7425L26.9484 29.7878C27.7864 33.7042 30.3389 37.0373 33.9015 38.8673Z" fill="#F59D38" stroke="#F59D38" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
									<NavDropdown className='me-3' title={user ? user.displayName : 'User'} id="basic-nav-dropdown" menuVariant='dark'>
										<Link to="/settings" className='nav-link drop-down ms-3' onClick={navigate}>Settings</Link>
										<Link to="/" className='nav-link drop-down ms-3' onClick={navLogout}>Log out</Link>
									</NavDropdown>
								</Container>
							}
						</Nav>
					</Container>
				</Container>
			</Navbar.Collapse>
		</Navbar>
	);
}
