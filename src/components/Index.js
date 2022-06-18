import IndexTable from './IndexTable';

export default function Index(props) {
	return (
		<IndexTable
			status={props.status}
			onNavigate={props.onNavigate}
		/>
	)
}