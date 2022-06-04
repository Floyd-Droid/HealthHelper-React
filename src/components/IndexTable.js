import React from 'react';
import { useTable, useRowSelect, useSortBy, useFilters } from 'react-table';

import { createOrUpdateEntries, deleteEntries, getEntries } from '../services/EntryService';
import { prepareEntries } from '../services/TableData';
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
  let status = props.status;
  let userId = props.userId
  let date = props.date

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

  const fetchEntries = () => {
    const url = `/api/${userId}/index`;

    getEntries(url)
      .then(body => {
        if (typeof body.errorMessage !== 'undefined') {
					setErrorMessages([body.errorMessage]);
          return [];
        } else {
					return body.entries;
        }
      })
      .then((entries) => {
				if (entries.length) {
					const preparedEntries = prepareEntries(entries, status);
					setEntries(preparedEntries);
					setData(preparedEntries);
				} else {
					addNewRow();
				}
      })
      .catch((err) => {
        console.log(err);
      })
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

  const submitChanges = () => {
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
      let url = `api/${userId}/index`;

      createOrUpdateEntries(url, newEntries, editedEntries)
        .then(body => {
          if (body.successMessages.length) {
            setSuccessMessages(body.successMessages);
          } 
          if (body.errorMessages.length) {
            setErrorMessages(body.errorMessages);
          }
          setEditedRowIndices([]);
          fetchEntries();
        })
        .catch(err => console.log(err));
    }
  }

  const addNewRow = () => {
    const newRow = {
      name: '',
      serving_by_weight: '',
      weight_unit: '',
      serving_by_volume: '',
      volume_unit: '',
      serving_by_item: '',
      calories: '',
      total_fat: '',
      sat_fat: '',
      trans_fat: '',
      poly_fat: '',
      mono_fat: '',
      cholesterol: '',
      sodium: '',
      total_carbs: '',
      total_fiber: '',
      sol_fiber: '',
      insol_fiber: '',
      total_sugars: '',
      added_sugars: '',
      protein: '',
      cost_per_container: '',
      servings_per_container: '',
      cost_per_serving: '',
    };
    setData(old => [...old, newRow]);
  }

  const deleteRows = () => {
    const existingEntryIds = [];
    const dataCopy = [...data];
    const entriesCopy = [...entries];

    for (let rowId of Object.keys(selectedEntries).reverse()) {
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
    setEntries(entriesCopy);
		setData(dataCopy)
    
    if (existingEntryIds.length) {
      const url = `/api/${userId}/index`;

      deleteEntries(url, existingEntryIds)
        .then(body => {
          if (typeof body.errorMessage !== 'undefined') {
						setErrorMessages([body.errorMessage]);
          } else if (typeof body.successMessage !== 'undefined') {
						setSuccessMessages([body.successMessage]);
					}
        })
        .catch((err) => {
          console.log(err);
        })
    }
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