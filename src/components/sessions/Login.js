import React, { useState } from 'react';
import fire from '../../firebase';

export default function Login() {
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(`submitted email: 
			${email} password: ${password}`);
	}
	
	return (
		<div>    
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					onChange={({ target }) =>     
						setEmail(target.value)}
					placeholder="Email"
				/>
				<br />
				<input
					type="password"
					onChange={({ target}) => 
						setPassword(target.value)}
					placeholder="Password"
				/>
				<br />
				<button type="submit">
					Sign in
				</button>
			</form>
		</div>
	)
};