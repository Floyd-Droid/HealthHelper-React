import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import GlobalContext from '../../context/GlobalContext';
import { passwordReset } from '../../firebase';

export default function ResetPassword() {
	const { updateMessages } = useContext(GlobalContext);
	const [email, setEmail] = React.useState();

	const handlePasswordReset = async () => {
		const res = await passwordReset(email);
		updateMessages(res);
	}

	return (
		<div className='container d-flex justify-content-center mt-5'>
			<div className='login-container form-container rounded'>
				<div className='container-fluid title-container d-flex justify-content-center p-2'>
					<h2 className='text-white'>
							<span>Reset Password</span>
					</h2>
				</div>
				<div className='d-flex flex-column justify-content-center align-items-center text-white my-3'>
					<div className='d-flex flex-column justify-content-start'>
						<span>Email</span>
						<input
							className='user-input rounded'
							type='text'
							onChange={e => setEmail(e.target.value)}
						/>
					</div>
					<button type='button' className='btn form-btn mt-4' onClick={handlePasswordReset}>Send email</button>
				</div>
				<div className='d-flex flex-column justify-content-center align-items-center text-white my-2'>
					<span className='py-2'><Link className='text-white' to='/' onClick={() => updateMessages({})}>Back to login</Link></span>
				</div>
			</div>
		</div>
	)
}