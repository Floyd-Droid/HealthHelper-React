import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithRedirect, getRedirectResult } from 'firebase/auth';

import UserContext from '../../context/UserContext';
import { auth,  googleProvider } from '../../firebase';

export default function Login() {
	const { user, isLoading } = useContext(UserContext);
	const [username, setUsername] = React.useState();
	const [email, setEmail] = React.useState();
	const [password, setPassword] = React.useState();

	const navigate = useNavigate();

	const handleLoginWithEmail = async (method) => {
		try {
			await signInWithEmailAndPassword(auth, email, password);
			navigate('/log');
		} catch (err) {
			console.log(err)
		}
	}

	const handleLoginWithGoogle = async () => {
		try {
			await signInWithRedirect(auth, googleProvider);
		} catch (err) {
			console.log(err);
		}
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