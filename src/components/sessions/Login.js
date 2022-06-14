import React from 'react';
import { logInWithEmailAndPassword, registerUserWithEmailAndPassword, listUsers } from '../../firebase';

export default function Login(props) {
	const type = props.type;
	const [email, setEmail] = React.useState();
	const [password, setPassword] = React.useState();

	const handleSubmit = () => {
		if (type === 'login') {
			logInWithEmailAndPassword(email, password);
		} else if (type === 'register') {
			registerUserWithEmailAndPassword(email, password);
		}
	}

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
				<button type="submit" onClick={handleSubmit}>
					Sign in
				</button>
			</div>
		</div>
	)
};