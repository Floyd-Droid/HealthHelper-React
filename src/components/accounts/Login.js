import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

export default function Login() {
	const [username, setUsername] = React.useState();
	const [email, setEmail] = React.useState();
	const [password, setPassword] = React.useState();

	const navigate = useNavigate();

	const handleSubmit = async (method) => {
		try {
			if (method === 'email') {
				const res = await signInWithEmailAndPassword(auth, email, password);
				if (res) navigate('/log');
			} else if (method === 'google') {
				console.log('placeholder')
			}
		} catch (err) {
			console.log(err)
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
				<div>
					<button className='btn btn-primary' onClick={() => handleSubmit('email')}>
						Log in
					</button>
					<button className='btn btn-primary' onClick={() => handleSubmit('google')}>
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