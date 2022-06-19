import React, { useContext } from 'react';
import { deleteUser, updateProfile, updateEmail, linkWithRedirect, getRedirectResult, linkWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import { auth, googleProvider, passwordReset } from '../../firebase';
import UserContext from '../../context/UserContext';
import Button from 'react-bootstrap/Button'


export default function Settings(props) {
	const { user, loading } = useContext(UserContext);
	const [username, setUsername] = React.useState();
	const [email, setEmail] = React.useState();

	const [emailLinkEmail, setEmailLinkEmail] = React.useState();
	const [emailLinkPassword, setEmailLinkPassword] = React.useState();

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

	const handleLinkEmailAccount = async () => {
		try {
			const credential = EmailAuthProvider.credential(emailLinkEmail, emailLinkPassword);
			await linkWithCredential(user, credential);
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
				<h4>Link with Email and password</h4>
				<p>
					If you created your account using Google or Github, and 
					would like to use different credentials to log in, you can 
					provide an email and password here. You will then be able 
					to log in using either set of credentials.
				</p>
				<p>Email</p>
				<input
					type="text"
					onChange={e => setEmailLinkEmail(e.target.value)}
				/>
				<p>Password</p>
				<input
					type="text"
					onChange={e => setEmailLinkPassword(e.target.value)}
				/>
					<Button 
						variant='primary' 
						onClick={handleLinkEmailAccount}>
						Add these credentials
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