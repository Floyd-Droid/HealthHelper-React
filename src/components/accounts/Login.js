import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRedirectResult } from 'firebase/auth';

import { auth, logInWithEmailAndPassword, logInWithGoogle } from '../../firebase';
import UserContext from '../../context/UserContext';

export default function Login() {
	const { user, isUserLoading, updateMessages } = useContext(UserContext);
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
			} catch (err) {
				console.log(err);
			}
		}

		redirectAfterLogin();
	})

	return (
		<div>
			<h2>Login</h2>
			<div>
				<input
					type="text"
					onChange={e => setEmail(e.target.value)}
					placeholder="Email"
				/>
				<br />
				<input
					type="password"
					onChange={e => setPassword(e.target.value)}
					placeholder="Password"
				/>
				<br />
				<div>
					<button className='btn btn-primary' onClick={handleLoginWithEmail}>
						Log in
					</button>
					<button className='btn btn-primary' onClick={handleLoginWithGoogle}>
						Log in with Google
					</button>
				</div>
				<div>
					Don't have an account? <Link to='/register'>Register here</Link>
				</div>
			</div>
		</div>
	)
};