import React from 'react';
import { useTable, useRowSelect, useSortBy, useFilters } from 'react-table';

import LogButtons from './buttons/LogButtons';
import { deleteEntries, getLogAndIndexEntries, updateEntries } from '../services/EntryService';
import { getFormattedDate, prepareEntries } from '../services/TableData';
import { CalculatedCell, IndeterminateCheckbox, Input, NumberRangeFilter, Select,
  SumFooter, TextFilter } from './SharedTableComponents';

function Table({ columns, data, indexEntries, logEntries, skipSelectedRowsReset, status, 
  updateEditedEntryIds, updateSelectedEntries, updateTableData }) {

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
    selectedFlatRows,
    state: {selectedRowIds }
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      autoResetFilters: false,
      autoResetSortBy: false,
      autoResetSelectedRows: !skipSelectedRowsReset,
      indexEntries,
      logEntries,
      status,
      updateEditedEntryIds,
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
    updateSelectedEntries(selectedFlatRows)
  }, [selectedFlatRows])

  return (
    <>
      <table className='table table-bordered table-sm position-relative' {...getTableProps()}>
        <thead className='thead-dark'>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th className='text-center text-white position-sticky top-0 bg-header' {...column.getHeaderProps(column.getSortByToggleProps())}
                  onClick={() => {
                    if (typeof column.toggleSortBy === 'function') {
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
  const [logEntries, setLogEntries] = React.useState([]);  
  const [indexEntries, setIndexEntries] = React.useState([]);
  const [editedEntryIds, setEditedEntryIds] = React.useState([]);
  const [selectedEntries, setSelectedEntries] = React.useState([]);
  const [skipSelectedRowsReset, setSkipSelectedRowsReset] = React.useState(true)

  const fetchEntries = () => {
    const logUrl = `/api/${userId}/logs?date=${formattedDate}`;
    const indexUrl = `/api/${userId}/index`;

    getLogAndIndexEntries(logUrl, indexUrl)
    .then((response) => {
      let logEntries = response.logEntries;
      let indexEntries = response.indexEntries;

      let preparedLogEntries = prepareEntries(logEntries, status);
      setData(preparedLogEntries);
      setLogEntries(preparedLogEntries);

      let preparedIndexEntries = prepareEntries(indexEntries, status);
      setIndexEntries(preparedIndexEntries);
    })
    .catch((err) => {
      console.log(err)
    })
  }

  React.useEffect(() => {
    fetchEntries();
  }, [date])

  const updateTableData = (rowIndex, columnId, value) => {
    setSkipSelectedRowsReset(true)
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

  const updateEditedEntryIds = (entryId, action) => {
    if (action === 'add') {
      setEditedEntryIds(old => [...old, entryId]);
    } else {
      setEditedEntryIds(editedEntryIds.filter((item) => String(item) != String(entryId)));
    }
  }

  const submitChanges = () => {
    const editedEntries = [];

    for (let editedEntryId of editedEntryIds) {
      for (let entry of data) {
        if (entry.id === editedEntryId) {
          editedEntries.push(entry);
        }
      }
    }

    if (editedEntries.length) {
      let url = `api/${userId}/logs?date=${formattedDate}`;

      updateEntries(url, editedEntries)
        .then(response => {
          if (response.ok) {
            console.log('update successful');
            fetchEntries();
          }
        })
        .catch(e => console.log('error in updateDb: \n', e))
    }
  }

  const deleteRows = () => {
    const ids = [];
    const dataCopy = [...data]

    for (let entry of selectedEntries.reverse()) {
      ids.push(entry.original.id);
      dataCopy.splice(entry.index, 1)
    }

    setSkipSelectedRowsReset(false);
    setData(dataCopy)
    setLogEntries(dataCopy)

    if (ids.length) {
      let url = `api/${userId}/logs?date=${formattedDate}`;
  
      deleteEntries(url, ids)
        .then((response) => {
          if (!response.ok) {
            console.log('Something went wrong when deleting log entries.')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  const updateSelectedEntries = (selectedRows) => {
    setSelectedEntries(selectedRows);
  }

  const resetData = () => {
    setData(logEntries);
    setEditedEntryIds([]);
  }

  React.useEffect(() => {
    setSkipSelectedRowsReset(true)
  }, [data])
  
  return (
    <>
      <div className='container-fluid p-3'>
        <Table
          columns={columns}
          data={data}
          indexEntries={indexEntries}
          logEntries={logEntries}
          skipSelectedRowsReset={skipSelectedRowsReset}
          status={status}
          updateEditedEntryIds={updateEditedEntryIds}
          updateSelectedEntries={updateSelectedEntries}
          updateTableData={updateTableData}
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