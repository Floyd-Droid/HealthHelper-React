import React, { useContext } from 'react';
import { deleteUser, updateProfile, updateEmail, linkWithRedirect, getRedirectResult } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import { auth, googleProvider, passwordReset } from '../../firebase';
import UserContext from '../../context/UserContext';
import Button from 'react-bootstrap/Button'


export default function Settings(props) {
	const { user, loading } = useContext(UserContext);
	const [username, setUsername] = React.useState();
	const [email, setEmail] = React.useState();
	const [linkEmail, setLinkEmail] = React.useState();
	const [linkPassword, setLinkPassword] = React.useState();

	const navigate = useNavigate();

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

	const handlePasswordReset = async () => {
		try {
			await passwordReset(user.email);
		} catch (err) {
			console.log(err);
		}
	}
	
	const handleLinkGoogleAccount = async () => {
		try {
			await linkWithRedirect(user, googleProvider);
		} catch (err) {
			console.log(err);
		}
	}

	const handleDeleteAccount = async () => {
		try {
			await deleteUser(user);
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
				<p>Click <a href='#' onClick={handlePasswordReset}>here</a> to reset your password</p>
			</div>
			<div>
				<h2>Link accounts</h2>
				<div>
					<h4>Link with Google</h4>
					<Button 
						variant='primary' 
						onClick={handleLinkGoogleAccount}>
						Link Google Account
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