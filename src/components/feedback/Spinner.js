import { Oval } from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default function Spinner(props) {
	return (
		<Oval
			height='40'
			width='40'
			color='green'
			ariaLabel='loading'
		/>
	)
}