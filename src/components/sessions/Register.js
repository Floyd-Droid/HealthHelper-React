import React from 'react';
import { registerUserWithEmailAndPassword } from '../../firebase';

export default function Register(props) {
	const [username, setUsername] = React.useState()
	const [email, setEmail] = React.useState();
	const [password, setPassword] = React.useState();

	const handleSubmit = (method) => {
		if (method === 'email') {
			registerUserWithEmailAndPassword(email, password);
		} else if (method === 'google') {
			console.log('placeholder')
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