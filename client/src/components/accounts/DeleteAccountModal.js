import React from 'react';
import Modal from 'react-bootstrap/Modal';

export default function DeleteAccountModal(props) {

	return (
		<Modal show={props.show}>
			<Modal.Header className='header modal-header text-white' >
				<Modal.Title>Delete Account</Modal.Title>
			</Modal.Header>
			<Modal.Body className='modal-body text-white'>
				Are you sure you would like to delete your account? This action cannot be undone.
			</Modal.Body>
			<Modal.Footer className='modal-body text-white border-0'>
			<button type='button' className='btn form-btn mx-4' onClick={props.onDeleteAccount}>
				Delete Account
			</button>
			<button type='button' className='btn form-btn mx-4' onClick={props.onHide}>
				Cancel
			</button>
			</Modal.Footer>
		</Modal>
	);
}
