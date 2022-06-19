import React, { useContext } from 'react';
import { getRedirectResult, signInWithRedirect } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import UserContext from '../../context/UserContext';
import { auth, registerUserWithEmailAndPassword, googleProvider } from '../../firebase';

export default function Register() {
	const { user, isLoading } = useContext(UserContext);
	const [username, setUsername] = React.useState()
	const [email, setEmail] = React.useState();
	const [password, setPassword] = React.useState();

	const navigate = useNavigate();

	const handleRegister = async (method) => {
		try {
			await registerUserWithEmailAndPassword(username, email, password);
			navigate('/log');
		} catch (err) {
			console.log(err);
		}
	}

	const handleRegisterWithGoogle = async () => {
		try {
			signInWithRedirect(auth, googleProvider);
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
	});

	return (
		<div>
			<h2>Create an Account</h2>
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
				<div>
					<p>Please provide a username for this site</p>
					<input
						type="text"
						onChange={e => setUsername(e.target.value)}
						placeholder="Username"
					/>
				</div>
				<br />
				<div>
					<button className='btn' onClick={handleRegister}>
						Register
					</button>
					<button className='btn' onClick={handleRegisterWithGoogle}>
						Register with Google
					</button>
				</div>
			</div>
		</div>
	)
};