import React from 'react';
import { useTable, useRowSelect, useSortBy, useFilters } from 'react-table';

import { deleteEntries, getEntries, updateEntries } from '../services/EntryService';
import { getFormattedDate, placeholderLogRow, prepareEntries } from '../services/TableData';
import { validateLogSubmission } from '../services/Validation';

import LogButtons from './buttons/LogButtons';
import MessageContainer from './Messages';
import { CalculatedCell, IndeterminateCheckbox, Input, NumberRangeFilter, Select,
  SumFooter, TextFilter } from './SharedTableComponents';


function Table({ columns, data, date, entries, errorMessages, skipSelectedRowsReset, status, successMessages,
  updateEditedRowIndices, updateSelectedEntries, updateTableData, validationMessages }) {

  const defaultColumn = React.useMemo(
    () => ({
      Cell: CalculatedCell,
      Filter: NumberRangeFilter,
      filter: 'between',
      Footer: SumFooter
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    prepareRow,
    rows,
    state: { selectedRowIds },
    toggleAllRowsSelected
  } = useTable(
    {
      columns,
      data,
      date,
      defaultColumn,
      autoResetFilters: false,
      autoResetSortBy: false,
      autoResetSelectedRows: !skipSelectedRowsReset,
      entries,
      status,
      updateEditedRowIndices,
      updateSelectedEntries,
      updateTableData,
    },
    useFilters,
    useSortBy,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
          Footer: () => null
        },
        ...columns
      ])
    }
  );

  React.useEffect(() => {
    toggleAllRowsSelected(false);
  }, [date])

  React.useEffect(() => {
    updateSelectedEntries(selectedRowIds)
  }, [selectedRowIds])

  return (
    <>
      {successMessages.length > 0 && 
        <MessageContainer messages={successMessages} variant='success' type='success'/>}
      {errorMessages.length > 0 && 
        <MessageContainer messages={errorMessages} variant='danger' type='error'/>}
      {validationMessages.length > 0 && 
        <MessageContainer messages={validationMessages} variant='danger' type='validation'/>}
    
      <table className='table table-bordered table-sm position-relative' {...getTableProps()}>
        <thead className='thead-dark'>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th className='text-center text-white position-sticky top-0 bg-header' 
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  onClick={() => {
                    if (column.canSort) {
                      column.toggleSortBy(!column.isSortedDesc)
                    }
                  }}>
                  {column.render('Header')}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>	
					{rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td className='p-0 m-0 text-center align-middle' {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
        <tfoot>
        {footerGroups.map(group => (
          <tr {...group.getFooterGroupProps()}>
            {group.headers.map(column => (
              <td className='bg-white text-center border-1 p-0 m-0' {...column.getFooterProps()}>{column.render('Footer')}</td>
            ))}
          </tr>
        ))}
      </tfoot>
      </table>
    </>
  )
}

export default function LogTable(props) {
  const status = props.status;
  const userId = props.userId;
  const date = props.date;
  const formattedDate = getFormattedDate(date, 'url');
  
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
    const logUrl = `/api/${userId}/logs?date=${formattedDate}`;

		try {
			const body = await getEntries(logUrl);

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
    const validationErrors = validateLogSubmission(data);
		const messages = {validationMessages: validationErrors, successMessages: [], errorMessages: []}
		updateMessages(messages);

		if (validationErrors.length) return false;

    const editedEntries = [];

    // remove duplicate indices in the case of multiple edits per entry
    const dedupedRowIndices = [...new Set(editedRowIndices)];

    for (const rowId of dedupedRowIndices) {
      editedEntries.push({
				amount: data[rowId].amount,
				amount_unit: data[rowId].amount_unit,
        id: data[rowId].id,
        name: data[rowId].name
      });
    }

    if (editedEntries.length) {
			const url = `api/${userId}/logs?date=${formattedDate}`;

			try {
				const body = await updateEntries(url, editedEntries);
				
				updateMessages(body);
				setEditedRowIndices([]);
				fetchEntries();
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
    
		const url = `api/${userId}/logs?date=${formattedDate}`;
		
		try {
			const body = await deleteEntries(url, entriesToDelete);
			updateMessages(body);
		} catch(err) {
			console.log(err);
		}
  }

  React.useEffect(() => {
    setSkipSelectedRowsReset(false);
		updateMessages({validationMessages: [], successMessages: [], errorMessages: []})
    fetchEntries();
  }, [date])

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
        <LogButtons
					data={data}
          onDeleteRows={deleteRows}
          onResetData={resetData}
          onNavSubmit={props.onNavSubmit}
          onSubmit={submitChanges}
        />
      </div>
    </>
  )
}