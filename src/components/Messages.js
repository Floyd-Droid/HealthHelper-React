import Alert from 'react-bootstrap/Alert';

export default function MessageContainer(props) {
	const messages = props.messages;
	const type = props.type;
	const variant = props.variant;

	const validationText = <p>Your changes were not submitted. Each entry should have:</p>
	const errorText = <p>An error occurred:</p>

	return (
		<Alert variant={variant} class='close'>
			{type === 'validation' && validationText}
			{type === 'error' && errorText}
			<ul>
				{messages.map((message, i) => <li key={i}>{message}</li>)}
			</ul>
		</Alert>
	)
}
