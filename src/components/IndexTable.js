import React, { useContext } from 'react';

import UserContext from '../context/UserContext';
import { createOrUpdateEntries, deleteEntries, getEntries } from '../services/EntryService';
import { newIndexRow, prepareEntries } from '../services/TableData';
import { validateIndexSubmission} from '../services/Validation';

import Table from './Table';
import TableButtons from './TableButtons';
import { IndexCostCell, Input, NumberRangeFilter, Select,
  TextFilter } from './SharedTableComponents';


export default function IndexTable(props) {
	const { user } = useContext(UserContext);
  const status = props.status;
  const userId = props.userId;

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
        Header: 'Name',
        accessor: 'name',
        Filter: TextFilter,
        filter: 'basic'
      },
      {
        Header: 'Serving (Weight)',
        accessor: 'serving_by_weight',
        disableFilters: true
      },
      {
        Header: 'Weight Unit',
        accessor: 'weight_unit',
        Cell: Select,
        disableFilters: true
      },
      {
        Header: 'Serving (Volume)',
        accessor: 'serving_by_volume',
        disableFilters: true
      },
      {
        Header: 'Volume Unit',
        accessor: 'volume_unit',
        Cell: Select,
        disableFilters: true
      },
      {
        Header: 'Serving (Item)',
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

  const [data, setData] = React.useState([]);
  const [entries, setEntries] = React.useState([]);
  const [editedRowIndices, setEditedRowIndices] = React.useState([]);
  const [selectedEntries, setSelectedEntries] = React.useState({});
  const [skipSelectedRowsReset, setSkipSelectedRowsReset] = React.useState(true);
  const [errorMessages, setErrorMessages] = React.useState([]);
  const [successMessages, setSuccessMessages] = React.useState([]);
  const [validationMessages, setValidationMessages] = React.useState([]);

	const updateTableEntries = (potentialData, potentialEntries) => {
		if (potentialData.length) {
			setEntries(potentialEntries);
			setData(potentialData);
		} else {
			setEntries([newIndexRow]);
			setData([newIndexRow]);
		}
	}

	const updateMessages = (messages) => {
		const validationMessages = typeof messages.validationMessages === 'undefined' ? [] : messages.validationMessages;

		setErrorMessages(messages.errorMessages);
		setSuccessMessages(messages.successMessages);
		setValidationMessages(validationMessages);
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
		setData(old => [...old, newIndexRow]);
  }
  
  const resetData = () => {
		setEditedRowIndices([]);
		updateMessages({validationMessages: [], successMessages: [], errorMessages: []});
    setData(entries);
  }

  const fetchEntries = async () => {
    const url = `/api/${userId}/index`;

		try {
			const body = await getEntries(url);

			if (body.errorMessages.length) {
				updateMessages(body);
			}
			
			const preparedEntries = prepareEntries(body.entries, status);
			updateTableEntries(preparedEntries, preparedEntries);
		} catch(err) {
      console.log(err);
    }
  }

	const submitChanges = async () => {
    const validationErrors = validateIndexSubmission(data);

		const messages = {validationMessages: validationErrors, successMessages: [], errorMessages: []}
		updateMessages(messages);

		if (validationErrors.length) return false;

    const editedEntries = [];
    const newEntries = [];

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

    if (editedEntries.length || newEntries.length) {
      const url = `api/${userId}/index`;

			try {
				const body = await createOrUpdateEntries(url, newEntries, editedEntries);

				updateMessages(body)
				setEditedRowIndices([]);
				fetchEntries();
			} catch(err) {
				console.log(err);
    	}
  	}
	}

	const deleteRows = async () => {
		if (!Object.values(selectedEntries).length)	return false;

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
      const url = `/api/${userId}/index`;

			try {
				const body = await deleteEntries(url, existingEntryIds);
				updateMessages(body);
			} catch(err) {
          console.log(err);
      }
    }
	}

  React.useEffect(() => {
    setSkipSelectedRowsReset(true);
  }, [data])

  React.useEffect(() => {
    fetchEntries();
  }, [])

  return (
    <>
      <div className='container-fluid p-3'>
        <Table
          columns={columns}
          data={data}
					defaultColumn={defaultColumn}
          entries={entries}
          errorMessages={errorMessages}
          skipSelectedRowsReset={skipSelectedRowsReset}
          status={status}
          successMessages={successMessages}
          updateEditedRowIndices={updateEditedRowIndices}
          updateSelectedEntries={updateSelectedEntries}
          updateTableData={updateTableData}
          validationMessages={validationMessages}
        />
      </div>
      <div className='container-fluid position-sticky bottom-0 bg-btn-container p-2'>
        <TableButtons
					data={data}
					status={status}
          onAddNewRow={addNewRow}
          onDeleteRows={deleteRows}
          onNavigate={props.onNavigate}
          onResetData={resetData}
          onSubmit={submitChanges}
        />
      </div>
    </>
  )
}