import React, { useContext } from 'react';
import { getRedirectResult } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import UserContext from '../../context/UserContext';
import { 
	auth, googleProvider, logInWithGoogle, passwordReset, 
	authEmailLink, updateUsername, updateUserEmail, deleteAccount,
	extractFirebaseErrorMessage
} from '../../firebase';

export default function Settings() {
	const { user, isBodyLoading, setIsBodyLoading, updateMessages } = useContext(UserContext);
	const [username, setUsername] = React.useState('');
	const [email, setEmail] = React.useState('');

	const [linkedEmail, setLinkedEmail] = React.useState('');
	const [linkedPassword, setLinkedPassword] = React.useState('');

	const navigate = useNavigate();

	const handleUpdateUsername = async () => {
		setIsBodyLoading(true);
		const res = await updateUsername(user.displayName, username);
		updateMessages(res);
	}

	const handleUpdateEmail = async () => {
		setIsBodyLoading(true);
		const res = await updateUserEmail(user.email, email);
		updateMessages(res);
	}

	const handlePasswordReset = async () => {
		setIsBodyLoading(true);
		const res = await passwordReset(user.email);
		updateMessages(res);
	}

	const handleLinkEmailAccount = async () => {
		setIsBodyLoading(true);
		const res = await authEmailLink(linkedEmail, linkedPassword);
		updateMessages(res);
	}
	
	const handleLinkGoogleAccount = async () => {
		setIsBodyLoading(true);
		const res = await logInWithGoogle(auth, googleProvider);
		updateMessages(res);
	}

	const handleDeleteAccount = async () => {
		setIsBodyLoading(true);
		const res = await deleteAccount();
		updateMessages(res);
	}

	React.useEffect(() => {
		async function redirectAfterLogin() {
			try {
				await getRedirectResult(auth);
			} catch (err) {
				const message = `Process failed: ${extractFirebaseErrorMessage(err)}.`;
				updateMessages({errorMessage: message})
			}
		}

		redirectAfterLogin();
		setIsBodyLoading(false);
	})

	if (!isBodyLoading) {
		return (
			<div className='container d-flex justify-content-center mt-3 text-white'>
				<div className='settings-container rounded bg-form'>
					<div className='container-fluid title-container d-flex justify-content-center bg-title p-2'>
						<h2 className='text-white'>
							<span>Settings</span>
						</h2>
					</div>

						<div className='mt-5'>
							<h4>Link with Email and password</h4>
							<p>
								If you created your account using Google or Github, and 
								would like to use different credentials to log in, you can 
								provide an email and password here. You will then be able 
								to log in using either set of credentials.
							</p>
						</div>
						<div className='d-flex justify-content-left align-items-end mt-3'>
							<div className='d-flex flex-column justify-content-start'>
								<span>Username</span>
								<input
									className='user-input rounded'
									type="text"
									onChange={e => setUsername(e.target.value)}
									placeholder={user !== null ? user.displayName : ''}
								/>
							</div>
							<button type='button' className='btn form-btn ms-5' onClick={handleUpdateUsername}>Update</button>
						</div>

						<div className='d-flex justify-content-left align-items-end mt-3'>
							<div className='d-flex flex-column justify-content-start'>
								<span>Email</span>
								<input
									className='user-input rounded'
									type="text"
									onChange={e => setEmail(e.target.value)}
									placeholder={user !== null ? user.email : ''}
								/>
							</div>
							<button type='button' className='btn form-btn ms-5' onClick={handleUpdateEmail}>Update</button>
						</div>
					</div>

					<div className='settings-section p-3 mt-5'>
						<div className='section-title'>
							<h3 className='text-white'>
								<span>Reset Password</span>
							</h3>
						</div>
						<div className='mt-3'>
							<span>Click <a href='#' onClick={handlePasswordReset}>here</a> to reset your password</span>
						</div>
					</div>

				<div className='settings-section p-3 mt-5'>
					<div className='section-title'>
						<h3 className='text-white'>
							<span>Delete Account</span>
						</button>
					</div>
					<button type='button' className='btn form-btn mt-3' onClick={handleDeleteAccount}>
						<span>Delete Account</span>
					</button>
				</div>

				</div>
			</div>
		)
	}
	return null;
}