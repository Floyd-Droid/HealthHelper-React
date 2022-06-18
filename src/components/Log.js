import DateForm from './DateForm';
import LogTable from './LogTable';

export default function Log(props) {
	return (
		<>
			<DateForm 
				date={props.date}
				onDateFormSubmit={props.onDateFormSubmit}
			/>
			<LogTable
				status={props.status}
				date={props.date} 
				onNavigate={props.onNavigate}
			/>
	</>
	)
}