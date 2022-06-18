import React, { useContext } from 'react';

import UserContext from '../../context/UserContext';
import Button from 'react-bootstrap/Button'
import { deleteUser, updateProfile, updateEmail  } from 'firebase/auth';


export default function Settings(props) {
	const { user, loading } = useContext(UserContext);
	const [username, setUsername] = React.useState();
	const [email, setEmail] = React.useState();
	const [linkEmail, setLinkEmail] = React.useState();
	const [linkPassword, setLinkPassword] = React.useState();

	const handleUpdateUsername = async () => {
		try {
			if (user.displayName !== username) {
				await updateProfile(user, {displayName: username});
			}
		} catch (err) {
			console.log(err);
		}
	}

	const handleUpdateEmail = async () => {
		try {
			if (user.email !== email) {
				await updateEmail(user, email);
			}
		} catch (err) {
			console.log(err)
		}
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
							placeholder={user !== null ? user.displayName : ''}
						/>
					<Button 
						variant='primary' 
						onClick={handleUpdateUsername}>
						Update
					</Button>
						<p>Email</p>
					<input
						type="text"
						onChange={e => setEmail(e.target.value)}
						placeholder={user !== null ? user.email : ''}
					/>
					<Button 
						variant='primary' 
						onClick={handleUpdateEmail}>
						Update
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