import Alert from 'react-bootstrap/Alert';
import React, { useRef, useContext } from 'react';

import GlobalContext from '../../context/GlobalContext';

export default function MessageContainer(props) {
	const { isBodyLoading } = useContext(GlobalContext);
	const messages = props.messages;
	const type = props.type;
	const variant = props.variant;

	const alertEl = useRef(null);

	const [show, setShow] = React.useState(true);

	React.useEffect(() => {
		if (!isBodyLoading) {
			setShow(true);
		} else {
			setShow(false);
		}
	}, [messages, isBodyLoading])

	React.useEffect(() => {
		if (show) {
			alertEl.current.scrollIntoView({block: 'center'});
		}
	}, [show, messages])

	if (show) {
		return (
			<Alert className='mb-2 mt-2' tabIndex='-1' ref={alertEl} variant={variant} show={show} onClose={() => setShow(false)} dismissible>
				{type === 'validation' && 
					<>
						<div className='d-flex justify-content-start align-items-start'>
							<div>
								<svg height='20' width='20' viewBox="0 0 64 64"  xmlns="http://www.w3.org/2000/svg">
									<path d="m5.9 62c-3.3 0-4.8-2.4-3.3-5.3l26.7-52.5c1.5-2.9 3.9-2.9 5.4 0l26.7 52.5c1.5 2.9 0 5.3-3.3 5.3z" fill="#ffce31"/>
									<g fill="#231f20">
										<path d="m27.8 23.6 2.8 18.5c.3 1.8 2.6 1.8 2.9 0l2.7-18.5c.5-7.2-8.9-7.2-8.4 0"/>
										<ellipse cx="32" cy="49.6" rx="4.2" ry="4.2"/>
									</g>
								</svg>
							</div>
							<p className='ms-3'>Your changes were not submitted. Each entry should have:</p>
						</div>
						<ul className='ps-5'>
							{messages.map((message, i) => <li key={i}>{message}</li>)}
						</ul>
					</>
				}

				{(type === 'error' || type === 'success') && 
					<>
					{messages.map((message, i) => 
						<div className='d-flex justify-content-start align-items-start'>
							<div>
								{type === 'error' &&
									<svg height='20' width='20' enableBackground="new 0 0 48 48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
										<path d="m21.2 44.8-18-18c-1.6-1.6-1.6-4.1 0-5.7l18-18c1.6-1.6 4.1-1.6 5.7 0l18 18c1.6 1.6 1.6 4.1 0 5.7l-18 18c-1.6 1.6-4.2 1.6-5.7 0z" fill="#f44336"/>
										<path d="m21.6 32.7c0-.3.1-.6.2-.9s.3-.5.5-.7.5-.4.8-.5.6-.2 1-.2.7.1 1 .2.6.3.8.5.4.4.5.7.2.6.2.9-.1.6-.2.9-.3.5-.5.7-.5.4-.8.5-.6.2-1 .2-.7-.1-1-.2-.5-.3-.8-.5c-.2-.2-.4-.4-.5-.7s-.2-.5-.2-.9zm4.2-4.6h-3.6l-.5-15.1h4.6z" fill="#fff"/>
									</svg>
								}
								{type === 'success' &&
									<svg height='20' width='20' enableBackground="new 0 0 48 48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
										<path d="m40.6 12.1-23.6 23.6-9.6-9.6-2.8 2.9 12.4 12.3 26.4-26.4z" fill="#43a047"/>
									</svg>
								}
							</div>
							<p className='ms-3'>{message}</p>
						</div>
					)}
					</>
				}
			</Alert>
		);
	}
	return null;
}
