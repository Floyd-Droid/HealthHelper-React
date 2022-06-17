import React, { useContext } from 'react';

import UserContext from '../../context/UserContext';
import Button from 'react-bootstrap/Button'
import { getRedirectResult, deleteUser, } from 'firebase/auth';
import { auth, authLink, googleProvider, } from '../../firebase';


export default function Settings(props) {
	const { user, loading } = useContext(UserContext);
	const [username, setUsername] = React.useState();
	const [email, setEmail] = React.useState();
	const [linkEmail, setLinkEmail] = React.useState();
	const [linkPassword, setLinkPassword] = React.useState();

	const handleInfoUpdate = () => {
		console.log('placeholder');
	}
	
	const handleLinkAccount = async () => {
		console.log('placeholder');
	}

	const handleDeleteAccount = async () => {
		try {
			await deleteUser(user);
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<div>
			<div>
				<h2>Account info</h2>
				<p>Username</p>
					<input
							type="text"
							onChange={e => setUsername(e.target.value)}
							placeholder={'username here'}
						/>
						<p>Email</p>
					<input
						type="text"
						onChange={e => setEmail(e.target.value)}
						placeholder={user !== null ? user.email : ''}
					/>
					<Button 
						variant='primary' 
						onClick={handleInfoUpdate}>
						Update Info
					</Button>
			</div>
			<div>
				<h2>Reset Password</h2>
			</div>
			<div>
				<h2>Link accounts</h2>
				<div>
					<h4>Link with Google</h4>
					<p>Email</p>
					<input
						type='text'
						onChange={e => setLinkEmail(e.target.value)}
						placeholder={props.email}
					/>
					<p>Password</p>
					<input
							type='text'
							onChange={e => setLinkPassword(e.target.value)}
							placeholder=''
					/>
					<Button 
						variant='primary' 
						onClick={handleLinkAccount}>
						Link
					</Button>
				</div>
				<div>
					<h2>Delete Account</h2>
					<Button 
						variant='Danger' 
						onClick={handleDeleteAccount}>
						Delete account
					</Button>
				</div>
			</div>
		</div>
	)
}