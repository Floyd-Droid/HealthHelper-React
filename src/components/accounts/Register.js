import React from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUserWithEmailAndPassword } from '../../firebase';

export default function Register() {
	const navigate = useNavigate();
	const [username, setUsername] = React.useState()
	const [email, setEmail] = React.useState();
	const [password, setPassword] = React.useState();

	const handleSubmit = async (method) => {
		if (method === 'email') {
			const res = await registerUserWithEmailAndPassword(username, email, password);
			if (res.successMessages.length) navigate('/log');
		} else if (method === 'google') {
			console.log('placeholder');
		}
	}

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
					<button className='btn' onClick={() => handleSubmit('email')}>
						Register
					</button>
					<button className='btn' onClick={() => handleSubmit('google')}>
						Register with Google
					</button>
				</div>
			</div>
		</div>
	)
};