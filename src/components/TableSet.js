import DateForm from './DateForm';
import LogTable from './LogTable';
import IndexTable from './IndexTable';

export default function TableSet(props) {
	return (
		<>
			{(props.status === 'log' || props.status === 'createLog') &&
			<>
				<DateForm 
					date={props.date}
					onDateFormSubmit={props.onDateFormSubmit}
				/>
				<LogTable
					date={props.date}
					status={props.status}
				/>
				</>
			}
			{props.status === 'index' &&
				<IndexTable
					status={props.status}
				/>
			}
	</>
	)
}