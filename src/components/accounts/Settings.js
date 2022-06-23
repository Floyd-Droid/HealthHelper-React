import React, { useContext } from 'react';
import { getRedirectResult } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import UserContext from '../../context/UserContext';
import Button from 'react-bootstrap/Button';
import MessageContainer from '../Messages';
import { 
	auth, googleProvider, logInWithGoogle, passwordReset, 
	authEmailLink, updateUsername, updateUserEmail, deleteAccount
} from '../../firebase';

export default function Settings() {
	const { user, loading } = useContext(UserContext);
	const [username, setUsername] = React.useState('');
	const [email, setEmail] = React.useState('');

	const [emailLinkEmail, setEmailLinkEmail] = React.useState('');
	const [emailLinkPassword, setEmailLinkPassword] = React.useState('');
	const [errorMessage, setErrorMessage] = React.useState('');
	const [successMessage, setSuccessMessage] = React.useState('');
	const [validationMessage, setValidationMessage] = React.useState('');

	const navigate = useNavigate();

	const updateMessages = async (res) => {
		if (typeof res.errorMessage !== 'undefined') {
			setErrorMessage(res.errorMessage);
		} else if (typeof res.successMessage !== 'undefined') {
			setSuccessMessage(res.successMessage);
		}
	}

	const handleUpdateUsername = async () => {
		const res = await updateUsername(user.displayName, username);
		updateMessages(res);
	}

	const handleUpdateEmail = async () => {
		const res = await updateUserEmail(user.email, email);
		updateMessages(res);
	}

	const handlePasswordReset = async () => {
		const res = await passwordReset(user.email);
		updateMessages(res);
	}

	const handleLinkEmailAccount = async () => {
		const res = await authEmailLink(emailLinkEmail, emailLinkPassword);
		updateMessages(res);
	}
	
	const handleLinkGoogleAccount = async () => {
		const res = await logInWithGoogle(auth, googleProvider);
		updateMessages(res);
	}

	const handleDeleteAccount = async () => {
		const res = await deleteAccount();
		updateMessages(res);
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
				{successMessage && 
					<MessageContainer messages={[successMessage]} variant='success' type='success'/>}
				{errorMessage && 
					<MessageContainer messages={[errorMessage]} variant='danger' type='error'/>}
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