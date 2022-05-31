import Alert from 'react-bootstrap/Alert';

export default function MessageContainer(props) {
    let messages = props.messages;
    
    return (
        <Alert variant='danger'> 
            <p>Your changes were not submitted. Each entry should have:</p>
            <ul>
                {messages.map((message, i) => <li key={i}>{message}</li>)}
            </ul>
        </Alert>
    )
}
