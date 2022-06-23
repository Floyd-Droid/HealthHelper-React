import React, { useContext } from 'react';
import { getRedirectResult } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import UserContext from '../../context/UserContext';
import MessageContainer from '../Messages';
import { 
	auth, registerUserWithEmailAndPassword, 
	googleProvider, logInWithGoogle 
} from '../../firebase';

export default function Register() {
	const { user, isLoading } = useContext(UserContext);
	const [username, setUsername] = React.useState('')
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [errorMessage, setErrorMessage] = React.useState('');
	const [successMessage, setSuccessMessage] = React.useState('');

	const navigate = useNavigate();

	const updateError = async (res) => {
		if (typeof res.errorMessage !== 'undefined') {
			setErrorMessage(res.errorMessage);
		} 

		if (typeof res.successMessage !== 'undefined') {
			setSuccessMessage(res.successMessage);
			navigate('/log');
		}
	}

	const handleRegister = async (method) => {
		const res = await registerUserWithEmailAndPassword(username, email, password);
		updateError(res);
	}

	const handleRegisterWithGoogle = async () => {
		const res = await logInWithGoogle(auth, googleProvider);
		updateError(res);
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
			{successMessage && 
        <MessageContainer messages={[successMessage]} variant='success' type='success'/>}
			{errorMessage && 
        <MessageContainer messages={[errorMessage]} variant='danger' type='error'/>}
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