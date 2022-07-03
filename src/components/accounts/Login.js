import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRedirectResult } from 'firebase/auth';

import Button from 'react-bootstrap/Button';

import { auth, logInWithEmailAndPassword, logInWithGoogle } from '../../firebase';
import UserContext from '../../context/UserContext';

export default function Login() {
	const { user, isUserLoading, setIsBodyLoading, updateMessages } = useContext(UserContext);
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');

	const navigate = useNavigate();

	const displayErrorOrNavigate = async (res) => {
		if (typeof res.errorMessage !== 'undefined') {
			updateMessages(res)
		} else {
			navigate('log');
		}
	}

	const handleLoginWithEmail = async () => {
		const res = await logInWithEmailAndPassword(email, password);
		displayErrorOrNavigate(res);
	}

	const handleLoginWithGoogle = async () => {
		const res = await logInWithGoogle();
		displayErrorOrNavigate(res);
	}

	React.useEffect(() => {
		async function redirectAfterLogin() {
			try {
				const result = await getRedirectResult(auth);
				if (result) navigate('/log');
				setIsBodyLoading(false);
			} catch (err) {
				console.log(err);
			}
		}

		redirectAfterLogin();
	})

	return (
		<div className='container d-flex justify-content-center mt-5'>
			<div className='login-container rounded bg-form'>
				<div className='container-fluid title-container d-flex justify-content-center bg-title p-2'>
					<h2 className='text-white'>Log in</h2>
				</div>

				<div className='container d-flex flex-column justify-content-around align-items-center mt-3'>
					<button className='btn form-btn my-1' onClick={handleLoginWithGoogle}>
						<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="28px" height="28px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
						<span className='ms-2'>Continue with Google</span>
					</button>
				</div>

				<div className='container-fluid d-flex justify-content-center align-items-center text-white my-3'>
					<span className='me-1'>-----</span>
					<span className='mx-1'>OR</span>
					<span className='ms-1'>-----</span>
				</div>
				
				<div className='d-flex flex-column justify-content-around align-items-center'>
					<input
						className='user-input mt-3 rounded'
						type='text'
						onChange={e => setEmail(e.target.value)}
						placeholder='Email'
					/>
					<input
						className='user-input mt-3 rounded'
						type='password'
						onChange={e => setPassword(e.target.value)}
						placeholder='Password'
					/>
					<button type='button' className='btn form-btn my-3' onClick={handleLoginWithEmail}>
						Log In
					</button>
				</div>


				<div className='d-flex justify-content-center text-white my-3'>
					<span>Don't have an account? <Link className='text-white' to='/register'>Register here</Link></span>
				</div>
			</div>
		</div>
	)
};