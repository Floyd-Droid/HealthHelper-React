import React, { useContext } from 'react';

import UserContext from '../context/UserContext';
import { createEntries, deleteEntries, getEntries, updateEntries } from '../services/EntryService';
import { getFormattedDate, placeholderLogRow, prepareEntries } from '../services/TableData';
import { validateLogSubmission } from '../services/Validation';

import Table from './Table';
import TableButtons from './TableButtons';
import { CalculatedCell, Input, NumberRangeFilter, Select,
  SumFooter, TextFilter } from './SharedTableComponents';


export default function LogTable(props) {
	const { user } = useContext(UserContext);
  const status = props.status;
  const userId = props.userId;
  const date = props.date;
  const formattedDate = getFormattedDate(date, 'url');

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
        Header: 'Name',
        accessor: 'name',
        Filter: TextFilter,
        filter: 'basic',
        Cell: ({value}) => value
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        Cell: Input,
        disableFilters: true,
      },
      {
        Header: 'Unit',
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
			setEntries([placeholderLogRow]);
			setData([placeholderLogRow]);
		}
	}

	const updateMessages = (messages) => {
		const validationMessages = typeof messages.validationMessages === 'undefined' ? [] : messages.validationMessages;

		setErrorMessages(messages.errorMessages);
		setSuccessMessages(messages.successMessages);
		setValidationMessages(validationMessages);
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
      idsCopy.splice(idsCopy.indexOf(entryId), 1)
      setEditedRowIndices(idsCopy);
    }
  }

  const updateSelectedEntries = (selectedRowIds) => {
    setSelectedEntries(selectedRowIds);
  }

	const resetData = () => {
    setEditedRowIndices([]);
		updateMessages({validationMessages: [], successMessages: [], errorMessages: []});
		setData(entries);
  }

	const fetchEntries = async () => {
		let url = '';

		if (status === 'log') {
			url = `/api/${userId}/log?date=${formattedDate}`;
		} else if (status === 'createLog') {
			url = `/api/${userId}/index`;
		}
    
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
		const newOrEditedLogEntries = [];
		let entryRowIndices = [];

		if (status === 'log') {
			const validationErrors = validateLogSubmission(data);
			const messages = {validationMessages: validationErrors, successMessages: [], errorMessages: []}
			updateMessages(messages);
	
			if (validationErrors.length) return false;

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
			let url = `/api/${userId}/log?date=${formattedDate}`;
			let body = {};

			try {
				if (status === 'log') {
					body = await updateEntries(url, newOrEditedLogEntries);

					setEditedRowIndices([]);
					fetchEntries();
				} else if (status === 'createLog') {
					body = await createEntries(url, newOrEditedLogEntries);
					setData(entries);
				}
				
				updateMessages(body);
			} catch(err) {
				console.log(err);
			}
    }
  }

	const deleteRows = async () => {
		if (!Object.values(selectedEntries).length)	return false;

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
    
		const url = `api/${userId}/log?date=${formattedDate}`;
		
		try {
			const body = await deleteEntries(url, entriesToDelete);
			updateMessages(body);
		} catch(err) {
			console.log(err);
		}
  }

  React.useEffect(() => {
		updateMessages({validationMessages: [], successMessages: [], errorMessages: []});

		if (status === 'log') {
			setSkipSelectedRowsReset(false);
			fetchEntries();
		}
  }, [date])

	React.useEffect(() => {
		updateMessages({validationMessages: [], successMessages: [], errorMessages: []})
    fetchEntries();
  }, [status])

  React.useEffect(() => {
    setSkipSelectedRowsReset(true);
  }, [data])
  
  return (
    <>
      <div className='container-fluid p-3'>
        <Table
          columns={columns}
          data={data}
          date={date}
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
          onDeleteRows={deleteRows}
          onResetData={resetData}
          onNavigate={props.onNavigate}
          onSubmit={submitChanges}
        />
      </div>
    </>
  )
}