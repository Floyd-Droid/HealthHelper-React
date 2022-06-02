import React from 'react';
import { useTable, useRowSelect, useSortBy, useFilters } from 'react-table';

import { deleteEntries, getEntries, updateEntries } from '../services/EntryService';
import { getFormattedDate, prepareEntries } from '../services/TableData';
import { validateLogSubmission } from '../services/Validation';

import LogButtons from './buttons/LogButtons';
import MessageContainer from './Messages';
import { CalculatedCell, IndeterminateCheckbox, Input, NumberRangeFilter, Select,
  SumFooter, TextFilter } from './SharedTableComponents';


function Table({ columns, data, date, entries, errorMessages, failedEntries, skipSelectedRowsReset, status, successMessages,
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
              <td className='bg-white border-1 p-0 m-0' {...column.getFooterProps()}>{column.render('Footer')}</td>
            ))}
          </tr>
        ))}
      </tfoot>
      </table>
    </>
  )
}

export default function LogTable(props) {
  let status = props.status;
  let userId = props.userId;
  let date = props.date;
  let formattedDate = getFormattedDate(date, 'url');
  
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
  const [failedEntries, setFailedEntries] = React.useState([]);
  
  const fetchEntries = () => {
    const logUrl = `/api/${userId}/logs?date=${formattedDate}`;

    getEntries(logUrl)
    .then(body => {
			if (typeof body.errorMessage !== 'undefined') {
				setErrorMessages([body.errorMessage]);
				return [];
			} else {
				return body.entries;
			}
    })
    .then(entries => {
      let preparedEntries = prepareEntries(entries, status);
      setEntries(preparedEntries);
      setData(preparedEntries);
    })
    .catch((err) => {
      console.log(err)
    })
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

  const submitChanges = () => {
    let validationErrors = validateLogSubmission(data);

    if (validationErrors.length) {
      setValidationMessages(validationErrors);
      return false;
    } else {
      setValidationMessages([]);
    }

    const editedEntries = [];

    // remove duplicate indices in the case of multiple edits per entry
    const dedupedRowIndices = [...new Set(editedRowIndices)];

    for (let rowId of dedupedRowIndices) {
      editedEntries.push({
				amount: data[rowId].amount,
				amount_unit: data[rowId].amount_unit,
        id: data[rowId].id,
        name: data[rowId].name
      });
    }

    if (editedEntries.length) {
      let url = `api/${userId}/logs?date=${formattedDate}`;

      updateEntries(url, editedEntries)
        .then(body => {
          if (typeof body.errorMessage !== 'undefined') {
						setErrorMessages([body.errorMessage]);
						setFailedEntries(body.failedEntries);
          } else if (typeof body.successMessage !== 'undefined') {
						setSuccessMessages([body.successMessage]);
					}
					setEditedRowIndices([]);
					fetchEntries();
        })
        .catch(e => console.log('error in updateDb: \n', e))
    }
  }

  const deleteRows = () => {
    const entryIds = [];
    const dataCopy = [...data];
    const entriesCopy = [...entries];

    for (let rowId of Object.keys(selectedEntries).reverse()) {
      entryIds.push({
				id: data[rowId].id,
				name: data[rowId].name
			});
      dataCopy.splice(rowId, 1);
      entriesCopy.splice(rowId, 1);
    }

    setSkipSelectedRowsReset(false);
    setEntries(entriesCopy);
    setData(dataCopy);

    if (entryIds.length) {
      let url = `api/${userId}/logs?date=${formattedDate}`;
  
      deleteEntries(url, entryIds)
        .then(body => {
          if (typeof body.errorMessage !== 'undefined') {
						setErrorMessages([body.errorMessage]);
						setFailedEntries(body.failedEntries);
          } else if (typeof body.successMessage !== 'undefined') {
						setSuccessMessages([body.successMessage]);
					}
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  const updateSelectedEntries = (selectedRowIds) => {
    setSelectedEntries(selectedRowIds);
  }

  const resetData = () => {
    setEditedRowIndices([]);
    setData(entries);
  }

  React.useEffect(() => {
    setSkipSelectedRowsReset(false);
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
					failedEntries={failedEntries}
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
          onDeleteRows={deleteRows}
          onResetData={resetData}
          onNavSubmit={props.onNavSubmit}
          onSubmit={submitChanges}
        />
      </div>
    </>
  )
}