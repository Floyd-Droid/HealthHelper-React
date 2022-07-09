import React, { useContext } from 'react';

import UserContext from '../context/UserContext';
import { createEntries, updateEntries, deleteEntries, getEntries } from '../services/EntryService';
import { newIndexRow, prepareEntries } from '../services/TableData';
import { validateIndexSubmission} from '../services/Validation';

import Table from './Table';
import TableButtons from './TableButtons';
import { IndexCostCell, Input, NumberRangeFilter, Select,
  TextFilter } from './SharedTableComponents';

export default function IndexTable(props) {
	const { user, isUserLoading, isBodyLoading, setIsBodyLoading, updateMessages } = useContext(UserContext);
  const status = props.status;
	const url = '/api/index';

	const [data, setData] = React.useState([]);
  const [entries, setEntries] = React.useState([]);
  const [editedRowIndices, setEditedRowIndices] = React.useState([]);
  const [selectedEntries, setSelectedEntries] = React.useState({});
  const [skipSelectedRowsReset, setSkipSelectedRowsReset] = React.useState(true);

	const defaultColumn = React.useMemo(
    () => ({
      Cell: Input,
      Filter: NumberRangeFilter,
      filter: 'between'
    }),
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: () => <div className='mb-4'>Name</div>,
        accessor: 'name',
        Filter: TextFilter,
        filter: 'basic'
      },
      {
        Header: <div className='mb-5'>Serving (Weight)</div>,
        accessor: 'serving_by_weight',
        disableFilters: true
      },
      {
        Header: <div className='mb-5'>Weight Unit</div>,
        accessor: 'weight_unit',
        Cell: Select,
        disableFilters: true
      },
      {
        Header: <div className='mb-5'>Serving (Volume)</div>,
        accessor: 'serving_by_volume',
        disableFilters: true
      },
      {
        Header: <div className='mb-5'>Volume Unit</div>,
        accessor: 'volume_unit',
        Cell: Select,
        disableFilters: true
      },
      {
        Header: <div className='mb-5'>Serving (Item)</div>,
        accessor: 'serving_by_item',
        disableFilters: true
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
        Header: 'Cost per Container',
        accessor: 'cost_per_container'
      },
      {
        Header: 'Servings per Container',
        accessor: 'servings_per_container'
      },
      {
        Header: 'Cost per Serving',
        accessor: 'cost_per_serving',
        Cell: IndexCostCell
      },
    ],
    []
  )

	const updateTableEntries = (potentialData, potentialEntries) => {
		if (potentialData.length) {
			setEntries(potentialEntries);
			setData(potentialData);
		} else {
			setEntries([newIndexRow]);
			setData([newIndexRow]);
		}
	}

	const updateTableData = (rowIndex, columnId, value) => {
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
    )
  }

  const updateEditedRowIndices = (rowId, action) => {
    if (action === 'add') {
      setEditedRowIndices(old => [...old, rowId]);
    } else if (action === 'remove') {
      const idsCopy = [...editedRowIndices];
      idsCopy.splice(idsCopy.indexOf(rowId), 1);
      setEditedRowIndices(idsCopy);
    }
  }

  const updateSelectedEntries = (selectedRowIds) => {
    setSelectedEntries(selectedRowIds);
  }

	const addNewRow = () => {
		updateMessages({}, true)
		setData(old => [...old, newIndexRow]);
  }
  
  const resetData = () => {
		setEditedRowIndices([]);
		updateMessages({}, true);
    setData(entries);
  }

  const fetchEntries = async () => {
		const tokenResult = await user.getIdToken(true);
		const body = await getEntries(url, tokenResult);

		if (typeof body.errorMessage !== 'undefined') {
			updateMessages(body);
		}
			
		const preparedEntries = prepareEntries(body.entries || [], status);
		updateTableEntries(preparedEntries, preparedEntries);
		setIsBodyLoading(false);
  }

	const submitChanges = async () => {
		const editedEntries = [];
    const newEntries = [];

    const validationErrors = validateIndexSubmission(data);

		if (validationErrors.length) {
			updateMessages({validationMessages: validationErrors});
			setIsBodyLoading(false);
			return false;
		}

    // remove duplicate ids in the case of multiple edits per entry
    const dedupedRowIds = [...new Set(editedRowIndices)];

    for (let rowId of dedupedRowIds) {
      editedEntries.push(data[rowId]);
    }

    for (let newEntry of data.reverse()) {
      if (typeof newEntry.id !== 'undefined') {
        break;
      } 
      newEntries.push(newEntry);
    }

		if (!(newEntries.length || editedEntries.length)) {
			updateMessages({}, true);
			return false;
		}
		
		setIsBodyLoading(true);

		const token = await user.getIdToken(true);

		if (editedEntries.length) {
			const editBody = await updateEntries(url, token, editedEntries);
			editBody.validationMessages = [];
			updateMessages(editBody, true);
			setEditedRowIndices([]);
		}

    if (newEntries.length) {
			const createBody = await createEntries(url, token, newEntries);
			createBody.validationMessages = [];
			const resetMessages = !Boolean(editedEntries.length)
			updateMessages(createBody, !resetMessages);
  	}

		fetchEntries();
	}

	const deleteRows = async () => {
		if (!Object.values(selectedEntries).length)	{
			updateMessages({}, true);
			return false;
		}

		setIsBodyLoading(true);
		
    const existingEntryIds = [];
    const dataCopy = [...data];
    const entriesCopy = [...entries];

    for (const rowId of Object.keys(selectedEntries).reverse()) {
      if (typeof data[rowId].id !== 'undefined') {
        existingEntryIds.push({
					id: data[rowId].id,
					name: data[rowId].name
				});
      }
      dataCopy.splice(rowId, 1);
      entriesCopy.splice(rowId, 1);
    }

    setSkipSelectedRowsReset(false);
		updateTableEntries(dataCopy, entriesCopy);
		
    if (existingEntryIds.length) {
			const tokenResult = await user.getIdToken(true);
			const body = await deleteEntries(url, tokenResult, existingEntryIds);
			updateMessages(body);
		}

		setIsBodyLoading(false);
	}

  React.useEffect(() => {
    setSkipSelectedRowsReset(true);
  }, [data])

  React.useEffect(() => {
		if (!isUserLoading) {
			fetchEntries();
		}
  }, [isUserLoading])


	if (!isBodyLoading) {
		return (
			<>
				<div className='container p-0'>
					<Table
						columns={columns}
						data={data}
						defaultColumn={defaultColumn}
						entries={entries}
						skipSelectedRowsReset={skipSelectedRowsReset}
						status={status}
						updateEditedRowIndices={updateEditedRowIndices}
						updateSelectedEntries={updateSelectedEntries}
						updateTableData={updateTableData}
					/>
				</div>
				<div className='container-fluid position-sticky bottom-0 d-flex justify-content-center bg-app p-0 m-0'>
					<TableButtons
						data={data}
						status={status}
						onAddNewRow={addNewRow}
						onDeleteRows={deleteRows}
						onResetData={resetData}
						onSubmit={submitChanges}
					/>
				</div>
			</>
		)
	}
	return null;
}