import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRedirectResult } from 'firebase/auth';

import GlobalContext from '../../context/GlobalContext';
import { auth, logInWithEmailAndPassword, logInWithGoogle, 
	registerUserWithEmailAndPassword, welcomeMessage, 
	extractFirebaseErrorMessage
} from '../../firebase';


export default function Login(props) {
	const status = props.status;
	const { isBodyLoading, setIsBodyLoading, updateMessages } = useContext(GlobalContext);
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [username, setUsername] = React.useState('');

	const navigate = useNavigate();

	const navigateAfterLogin = (res) => {
		if (typeof res.errorMessage === 'undefined') {
			if (status === 'register' || (typeof res.isAccountNew !== 'undefined' && res.isAccountNew === true)) {
				navigate('/index');
			} else if (status === 'login') {
				navigate('/log');
			}
		}
	}

	const handleLoginOrRegisterWithEmail = async () => {
		setIsBodyLoading(true);
		let res = {};

		if (status === 'login') {
			res = await logInWithEmailAndPassword(email, password);
		} else if (status === 'register') {
			res = await registerUserWithEmailAndPassword(username, email, password);
		}

		updateMessages(res);
		navigateAfterLogin(res);
	}

	const handleLoginWithGoogle = async () => {
		setIsBodyLoading(true);
		const res = await logInWithGoogle();
		updateMessages(res);
	}

	const checkIfNewAccount = (result) => {
		const accountCreationTime = Number(result.user.metadata.createdAt);
		const now = new Date();
		const minute = 60000;

		const isAccountNew = (now.getTime() - minute) < accountCreationTime;
		return isAccountNew;
	}

	React.useEffect(() => {
		async function redirectAfterLogin() {
			try {
				const result = await getRedirectResult(auth);
				if (result) {
					const isAccountNew = checkIfNewAccount(result);
					if (isAccountNew) {
						updateMessages({successMessage: welcomeMessage});
					}
					navigateAfterLogin({isAccountNew: isAccountNew});
				}
			} catch (err) {
				const message = `Process failed: ${extractFirebaseErrorMessage(err)}.`;
				updateMessages({errorMessage: message});
			}
			setIsBodyLoading(false);
		}

		redirectAfterLogin();
	}, [isBodyLoading])

	if (!isBodyLoading) {
		return (
			<div className='container d-flex justify-content-center mt-5'>
				<div className='login-container rounded bg-form'>
					<div className='container-fluid title-container d-flex justify-content-center bg-title p-2'>
						<h2 className='text-white'>
							{status === 'login' &&
								<span>Log in</span>
							}
							{status === 'register' &&
								<span>Register</span>
							}
						</h2>
					</div>
					<div className='container d-flex flex-column justify-content-around align-items-center my-4'>
						<button className='btn form-btn my-1' onClick={handleLoginWithGoogle}>
							<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="28px" height="28px">
								<path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
								<path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
								<path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
								<path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
							</svg>
							<span className='ms-2'>Continue with Google</span>
						</button>
					</div>
					<div className='container-fluid d-flex justify-content-center align-items-center text-white my-4'>
						<span className='me-1'>----------</span>
						<span className='mx-1'>OR</span>
						<span className='ms-1'>----------</span>
					</div>
					<div className='d-flex flex-column justify-content-around align-items-center text-white'>
						<div className='d-flex flex-column justify-content-start'>
							<span>Email</span>
							<input
								className='user-input rounded'
								type='text'
								onChange={e => setEmail(e.target.value)}
							/>
						</div>
						<div className='d-flex flex-column justify-content-start mt-3' >
							<span>Password</span>
							<input
								className='user-input rounded'
								type='password'
								onChange={e => setPassword(e.target.value)}
							/>
						</div>
						{status === 'register' &&
							<div className='d-flex flex-column justify-content-start mt-3'>
								<span>Username</span>
								<input
									className='user-input rounded'
									type="text"
									onChange={e => setUsername(e.target.value)}
								/>
							</div>
						}
						<button type='button' className='btn form-btn my-3' onClick={handleLoginOrRegisterWithEmail}>
							{status === 'login' &&
								<span>Log In</span>
							}
							{status === 'register' &&
								<span>Register</span>
							}
						</button>
					</div>
					<div className='d-flex justify-content-center text-white my-3'>
						{status === 'login' &&
							<span>Don't have an account? <Link className='text-white' to='/register' onClick={() => updateMessages({})}>Register here</Link></span>
						}
						{status === 'register' &&
							<span>Already have an account? <Link className='text-white' to='/' onClick={() => updateMessages({})}>Log in</Link></span>
						}
					</div>
				</div>
			</div>
		);
	}
	return null;
};
