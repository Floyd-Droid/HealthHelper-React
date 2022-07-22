import React, { useContext } from 'react';

import { createEntries, deleteEntries, getEntries, updateEntries } from '../../services/EntryService';
import { getFormattedDate, placeholderLogRow, prepareEntries } from '../../services/TableData';
import { validateLogSubmission } from '../../services/Validation';

import GlobalContext from '../../context/GlobalContext';
import Table from './Table';
import TableButtons from './TableButtons';
import { CalculatedCell, Input, NumberRangeFilter, Select,
  SumFooter, TextFilter } from './SharedTableComponents';


export default function LogTable(props) {
	const { user, isUserLoading, isBodyLoading, setIsBodyLoading, updateMessages, date } = useContext(GlobalContext);
  const status = props.status;
  const formattedDate = getFormattedDate(date, 'url');

	let url = `/api/log?date=${formattedDate}`;

	const [data, setData] = React.useState([]);
  const [entries, setEntries] = React.useState([]);  
  const [editedRowIndices, setEditedRowIndices] = React.useState([]);
  const [selectedEntries, setSelectedEntries] = React.useState({});
	const [skipFiltersReset, setSkipFiltersReset] = React.useState(true);
  const [skipSelectedRowsReset, setSkipSelectedRowsReset] = React.useState(true);
	const [showFooter, setShowFooter] = React.useState(false);
	const [sortState, setSortState] = React.useState({colId: '', desc: false});

	const defaultColumn = React.useMemo(
    () => ({
      Cell: CalculatedCell,
      Filter: NumberRangeFilter,
      filter: 'between',
      Footer: SumFooter
    }),
    []
  );
  
  const columns = React.useMemo(
    () => [
      {
        Header: <div className='mb-4'>Name</div>,
        accessor: 'name',
        Filter: TextFilter,
        filter: 'basic',
        Cell: ({value}) => <div className='text-white ms-2'>{value}</div>
      },
      {
        Header: <div className='mb-5'>Amount</div>,
        accessor: 'amount',
        Cell: Input,
        disableFilters: true,
      },
      {
        Header: <div className='mb-5'>Unit</div>,
        accessor: 'amount_unit',
        Cell: Select,
        disableFilters: true,
      },
      {
        Header: 'Calories',
        accessor: 'calories'
      },
      {
        Header: 'Total Fat',
        accessor: 'total_fat'
      },
      {
        Header: 'Sat. Fat',
        accessor: 'sat_fat'
      },
      {
        Header: 'Trans Fat',
        accessor: 'trans_fat'
      },
      {
        Header: 'Poly. Fat',
        accessor: 'poly_fat'
      },
      {
        Header: 'Mono. Fat',
        accessor: 'mono_fat'
      },
      {
        Header: 'Cholesterol',
        accessor: 'cholesterol'
      },
      {
        Header: 'Sodium',
        accessor: 'sodium'
      },
      {
        Header: 'Total Carbs',
        accessor: 'total_carbs'
      },
      {
        Header: 'Dietary Fiber',
        accessor: 'total_fiber'
      },
      {
        Header: 'Soluble Fiber',
        accessor: 'sol_fiber'
      },
      {
        Header: 'Insoluble Fiber',
        accessor: 'insol_fiber'
      },
      {
        Header: 'Total Sugars',
        accessor: 'total_sugars'
      },
      {
        Header: 'Added Sugars',
        accessor: 'added_sugars'
      },
      {
        Header: 'Protein',
        accessor: 'protein'
      },
      {
        Header: 'Cost',
        accessor: 'cost_per_serving'
      },
    ],
    []
  );

	const updateTableEntries = (potentialData, potentialEntries) => {
		if (potentialData.length) {
			setEntries(potentialEntries);
			setData(potentialData);
		} else {
			setEntries([placeholderLogRow]);
			setData([placeholderLogRow]);
		}
	}

  const updateTableData = (rowIndex, columnId, value) => {
    setSkipSelectedRowsReset(true);
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  }

  const updateEditedRowIndices = (entryId, action) => {
    if (action === 'add') {
      setEditedRowIndices(old => [...old, entryId]);
    } else {
      const idsCopy = [...editedRowIndices];
      idsCopy.splice(idsCopy.indexOf(entryId), 1);
      setEditedRowIndices(idsCopy);
    }
  }

  const updateSelectedEntries = (selectedRowIds) => {
    setSelectedEntries(selectedRowIds);
  }

	const resetData = () => {
		setShowFooter(false);
    setEditedRowIndices([]);
		updateMessages({}, true);
		setSkipFiltersReset(false);
		setData(entries);
  }

	const fetchEntries = async () => {
		if (status === 'createLog') {
			url = '/api/index';
		}
		
		const tokenResult = await user.getIdToken(true);
		const body = await getEntries(url, tokenResult);

		if (typeof body.errorMessage !== 'undefined') {
			updateMessages(body);
		}
		
		const preparedEntries = prepareEntries(body.entries || [], status);
		updateTableEntries(preparedEntries, preparedEntries);
		setIsBodyLoading(false);
		setShowFooter(true);
  }

	const submitChanges = async () => {
		setIsBodyLoading(true);

		const newOrEditedLogEntries = [];
		let entryRowIndices = [];

		if (status === 'log') {
			const validationErrors = validateLogSubmission(data);

			if (validationErrors.length) {
				updateMessages({validationMessages: validationErrors});
				setIsBodyLoading(false);
				return false;
			} else {
				updateMessages({validationMessages: []});
			}

			// remove duplicate indices in the case of multiple edits per entry
			entryRowIndices = [...new Set(editedRowIndices)];

		} else if (status === 'createLog') {
			entryRowIndices = Object.keys(selectedEntries);
		}

		for (const rowId of entryRowIndices) {
			newOrEditedLogEntries.push({
				amount: data[rowId].amount,
				amount_unit: data[rowId].amount_unit,
				id: data[rowId].id,
				name: data[rowId].name
			});
		}

    if (newOrEditedLogEntries.length) {
			let body = {};

			const tokenResult = await user.getIdToken(true);

			if (status === 'log') {
				body = await updateEntries(url, tokenResult, newOrEditedLogEntries);

				setEditedRowIndices([]);
				fetchEntries();
			} else if (status === 'createLog') {
				body = await createEntries(url, tokenResult, newOrEditedLogEntries);
				setData(entries);
				setIsBodyLoading(false);
			}
			
			updateMessages(body);
    } else {
			setIsBodyLoading(false);
		}
  }

	const deleteRows = async () => {
		if (!Object.values(selectedEntries).length)	{
			updateMessages({}, true);
			return false;
		}
		
		setIsBodyLoading(true);

    const entriesToDelete = [];
    const dataCopy = [...data];
    const entriesCopy = [...entries];

    for (const rowId of Object.keys(selectedEntries).reverse()) {
      entriesToDelete.push({
				id: data[rowId].id,
				name: data[rowId].name
			});
      dataCopy.splice(rowId, 1);
      entriesCopy.splice(rowId, 1);
    }

    setSkipSelectedRowsReset(false);
		updateTableEntries(dataCopy, entriesCopy);
		
		const tokenResult = await user.getIdToken(true);
		const body = await deleteEntries(url, tokenResult, entriesToDelete);

		updateMessages(body);
		setIsBodyLoading(false);
  }

	const sortData = (colId) => {
		const dataCopy = [...data];
		const sortedEntries = [];

		const descending = sortState.colId === colId ? !sortState.desc : false;
		setSortState({colId: colId, desc: descending});

		if (colId === 'name') {
			dataCopy.sort((a, b) => {
				const comp = a[colId] > b[colId];
				return (comp && !descending) ? 1 : -1;
			})
		} else {
			dataCopy.sort((a, b) => {
				// empty values will go to the end regardless of asc/desc
				if (a[colId] === '') return 1;
				if (b[colId] === '') return -1;

				const comp = parseFloat(a[colId]) - parseFloat(b[colId]);
				return descending ? (comp * -1) : comp;
			})
		}

		for (const dataRow of dataCopy) {
			const dataId = dataRow.id

			for (const entry of entries) {
				if (entry.id === dataId) {
					sortedEntries.push(entry);
					break;
				}
			}
		}

		setEntries(sortedEntries);
		setData(dataCopy);
	}

  React.useEffect(() => {
		updateMessages({});

		if (status === 'log' && !isUserLoading) {
			setIsBodyLoading(true);
			setSkipSelectedRowsReset(false);
			fetchEntries();
		}
  }, [date, isUserLoading])

	React.useEffect(() => {
		updateMessages({});

		if (!isUserLoading) {
			fetchEntries();
		}
  }, [status, isUserLoading])

  React.useEffect(() => {
    setSkipSelectedRowsReset(true);
		setSkipFiltersReset(true);
		setShowFooter(true);
  }, [data])

	if (!isBodyLoading) {
		return (
			<>
				<div className='log-table-container'>
					<Table
						columns={columns}
						data={data}
						date={date}
						defaultColumn={defaultColumn}
						entries={entries}
						showFooter={showFooter}
						skipFiltersReset={skipFiltersReset}
						skipSelectedRowsReset={skipSelectedRowsReset}
						sortData={sortData}
						status={status}
						updateEditedRowIndices={updateEditedRowIndices}
						updateSelectedEntries={updateSelectedEntries}
						updateTableData={updateTableData}
					/>
				</div>
				<div className='container-fluid table-button-container position-sticky bottom-0 d-flex justify-content-center bg-app-body p-0'>
					<TableButtons
						data={data}
						status={status}
						onDeleteRows={deleteRows}
						onResetData={resetData}
						onSubmit={submitChanges}
					/>
				</div>
			</>
		);
	}
	return null;
}
