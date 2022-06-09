import Alert from 'react-bootstrap/Alert';
import React from 'react';

export default function MessageContainer(props) {
	const messages = props.messages;
	const type = props.type;
	const variant = props.variant;

	const validationText = <p>Your changes were not submitted. Each entry should have:</p>
	const errorText = <p>An error occurred:</p>

	const [show, setShow] = React.useState(true);

	React.useEffect(() => {
		setShow(true);
	}, [messages])

	if (show) {
		return (
			<Alert variant={variant} show={show} onClose={() => setShow(false)} dismissible>
				{type === 'validation' && validationText}
				{type === 'error' && errorText}
				<ul>
					{messages.map((message, i) => <li key={i}>{message}</li>)}
				</ul>
			</Alert>
		)
	}
	return null;
}
