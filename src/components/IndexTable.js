import React from 'react';
import { useTable, useRowSelect, useSortBy, useFilters } from 'react-table';

import { createOrUpdateEntries, deleteEntries, getEntries } from '../services/EntryService';
import { newIndexRow, prepareEntries } from '../services/TableData';
import { validateIndexSubmission} from '../services/Validation.js';

import IndexButtons from './buttons/IndexButtons';
import MessageContainer from './Messages';
import { IndeterminateCheckbox, IndexCostCell, Input, NumberRangeFilter, Select,
  TextFilter } from './SharedTableComponents';

	
function Table({ columns, data, entries, errorMessages, skipSelectedRowsReset, status, successMessages,
  updateEditedRowIndices, updateSelectedEntries, updateTableData, validationMessages }) {

  const defaultColumn = React.useMemo(
    () => ({
      Cell: Input,
      Filter: NumberRangeFilter,
      filter: 'between'
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    state: { selectedRowIds }
  } = useTable(
    {
      columns,
      data,
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
          Cell: ({row}) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns
      ])
    }
  )

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
      </table>
    </>
  )
}

export default function IndexTable(props) {
  const status = props.status;
  const userId = props.userId
  const date = props.date

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

  const fetchEntries = async () => {
    const url = `/api/${userId}/index`;
		let entries;

		try {
			const body = await getEntries(url);

			if (typeof body.errorMessage !== 'undefined') {
				setErrorMessages([body.errorMessage]);
				entries = [];
			} else {
				entries = body.entries;
			}
	
			const preparedEntries = prepareEntries(entries, status);
			setTable(preparedEntries, preparedEntries);
		} catch(err) {
      console.log(err);
    }
  }

	const submitChanges = async () => {
    let validationErrors = validateIndexSubmission(data);

    if (validationErrors.length) {
      setValidationMessages(validationErrors);
      return false;
    } else {
      setValidationMessages([]);
    }

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

				if (body.successMessages.length) {
					setSuccessMessages(body.successMessages);
				} 
				if (body.errorMessages.length) {
					setErrorMessages(body.errorMessages);
				}

				setEditedRowIndices([]);
				fetchEntries();
			} catch(err) {
				console.log(err);
    	}
  	}
	}

	const deleteRows = async () => {
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
		setTable(dataCopy, entriesCopy);
		
    if (existingEntryIds.length) {
      const url = `/api/${userId}/index`;

			try {
				const body = await deleteEntries(url, existingEntryIds);

				if (typeof body.errorMessage !== 'undefined') {
					setErrorMessages([body.errorMessage]);
				} else if (typeof body.successMessage !== 'undefined') {
					setSuccessMessages([body.successMessage]);
				}
			} catch(err) {
          console.log(err);
      }
    }
  }

	const setTable = (potentialData, potentialEntries) => {
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

  const addNewRow = () => {
		setData(old => [...old, newIndexRow]);
  }

  const updateSelectedEntries = (selectedRowIds) => {
    setSelectedEntries(selectedRowIds);
  }
  
  const resetData = () => {
    setData(entries);
    setEditedRowIndices([]);
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
        <IndexButtons
          onAddNewRow={addNewRow}
          onDeleteRows={deleteRows}
          onNavSubmit={props.onNavSubmit}
          onResetData={resetData}
          onSubmit={submitChanges}
        />
      </div>
    </>
  )
}