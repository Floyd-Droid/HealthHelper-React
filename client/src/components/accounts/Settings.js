import React, { useContext } from 'react';
import { getRedirectResult } from 'firebase/auth';

import GlobalContext from '../../context/GlobalContext';
import DeleteAccountModal from './DeleteAccountModal';
import { 
	auth, googleProvider, logInWithGoogle, passwordReset, 
	authEmailLink, updateUsername, updateUserEmail, deleteAccount,
	extractFirebaseErrorMessage
} from '../../firebase';


export default function Settings() {
	const { user, isBodyLoading, setIsBodyLoading, updateMessages } = useContext(GlobalContext);
	const [username, setUsername] = React.useState('');
	const [email, setEmail] = React.useState('');

	const [linkedEmail, setLinkedEmail] = React.useState('');
	const [linkedPassword, setLinkedPassword] = React.useState('');

	const [deleteModalShow, setDeleteModalShow] = React.useState(false);

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
				updateMessages({errorMessage: message});
			}
		}

		redirectAfterLogin();
		setIsBodyLoading(false);
	})

	if (!isBodyLoading) {
		return (
			<div className='container d-flex justify-content-center text-white my-3'>
				<div className='settings-container form-container rounded'>
					<div className='container-fluid title-container d-flex justify-content-center p-2'>
						<h2 className='text-white'>
							<span>Settings</span>
						</h2>
					</div>

					<DeleteAccountModal 
						show={deleteModalShow} 
						onHide={() => setDeleteModalShow(false)} 
						onDeleteAccount={handleDeleteAccount}
					/>

					<div className='settings-section p-3'>
						<div className='section-title'>
							<h3 className='text-white'>
								<span>Account info</span>
							</h3>
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
								<span>Link Accounts</span>
							</h3>
						</div>
						<div className='mt-4'>
							<button type='button' className='btn form-btn' onClick={handleLinkGoogleAccount}>
								<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="28px" height="28px">
									<path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
									<path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
									<path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
									<path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
								</svg>
								<span className='ms-2'>Link with Google</span>
							</button>

							<div className='mt-5'>
								<h4>Link with Email and password</h4>
								<p>
									If you created your account using Google or Github, and 
									would like to use different credentials to log in, you can 
									provide an email and password here. You will then be able 
									to log in using either set of credentials.
								</p>
							</div>
							<div className='d-flex justify-content-left align-items-center'>
								<div className='d-flex flex-column justify-content-start me-5'>
									<span>Email</span>
									<input
										className='user-input rounded'
										type="text"
										onChange={e => setLinkedEmail(e.target.value)}
									/>
								</div>
								<div className='d-flex flex-column justify-content-start'>
									<span>Password</span>
									<input
										className='user-input rounded'
										type="password"
										onChange={e => setLinkedPassword(e.target.value)}
									/>
								</div>
							</div>
							<button type='button' className='btn form-btn mt-3' onClick={handleLinkEmailAccount}>Add these credentials</button>
						</div>
					</div>

					<div className='settings-section p-3 mt-5'>
						<div className='section-title'>
							<h3 className='text-white'>
								<span>Delete Account</span>
							</h3>
						</div>
						<button type='button' className='btn form-btn mt-3' onClick={() => setDeleteModalShow(true)}>
							<span>Delete Account</span>
						</button>
					</div>

				</div>
			</div>
		);
	}
	return null;
}
