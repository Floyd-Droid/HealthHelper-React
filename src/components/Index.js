import IndexTable from './IndexTable';

export default function Index(props) {
	return (
		<IndexTable
			status={props.status}
			userId={props.userId}
			onNavSubmit={props.updateStatus}
		/>
	)
}