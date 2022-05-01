import React from 'react';
import { useTable, useRowSelect, useSortBy, useFilters } from 'react-table';

import LogButtons from './buttons/LogButtons';
import { getEntries, updateEntryData } from '../services/EntryService';
import { getFormattedDate, prepareForLogTable } from '../services/TableData';
import { EditableInputCell, EditableSelectCell, IndeterminateCheckbox, 
  TextFilter, NumberRangeFilter } from './SharedTableComponents';

function Table({ columns, data, dbData, updateEditedEntryIds, updateTableData }) {

  const defaultColumn = React.useMemo(
    () => ({
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
    selectedFlatRows,
    state: {selectedRowIds }
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      autoResetFilters: false,
      autoResetSortBy: false,
      autoResetSelectedRows: false,
      dbData,
      updateEditedEntryIds,
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
        },
        ...columns
      ])
    }
  )

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
      </table>
    </>
  )
}

export default function LogTable(props) {
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
        Header: 'Amount',
        accessor: 'amount',
        Cell: EditableInputCell,
        disableFilters: true
      },
      {
        Header: 'Unit',
        accessor: 'amount_unit',
        Cell: EditableSelectCell,
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
        Header: 'Cost',
        accessor: 'cost'
      },
    ],
    []
  )

  const [entries, setEntries] = React.useState([])
  const [data, setData] = React.useState([])
  const [dbData, setDbData] = React.useState([]);
  const [editedEntryIds, setEditedEntryIds] = React.useState([]);

  const fetchEntries = () => {
    const formattedDate = getFormattedDate(date, 'url');
    const url = `/api/${userId}/logs?date=${formattedDate}`;

    getEntries(url)
      .then(entries => {
        setEntries(entries)
        const preparedEntries = prepareForLogTable(entries)
        setData(preparedEntries)
        setDbData(preparedEntries)
      })
  }

  React.useEffect(() => {
    fetchEntries()
  }, [date])

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

  const updateEditedEntryIds = (entryId, action) => {
    // Track which existing entries have been edited by the user
    if (action === 'add') {
      setEditedEntryIds(old => [...old, entryId])
    } else {
      setEditedEntryIds(editedEntryIds.filter((item) => String(item) != String(entryId)))
    }
  }

  const submitChanges = () => {

    const editedEntries = [];

    for (let editedEntryId of editedEntryIds) {
      for (let entry of data) {
        if (entry.id === editedEntryId) {
          editedEntries.push(entry)
        }
      }
    }

    let formattedDate = getFormattedDate(date, 'url')

    let url = `api/${userId}/logs?date=${formattedDate}`;
    updateEntryData(url, editedEntries)
      .then(response => {
        fetchEntries();
      }).catch(e => console.log('error in updateDb: \n', e))
  }

  const resetData = () => {
    setData(dbData)
    setEditedEntryIds([])
  }
  
  return (
    <>
      <div className='container-fluid p-3'>
        <Table
          columns={columns}
          data={data}
          dbData={dbData}
          updateEditedEntryIds={updateEditedEntryIds}
          updateTableData={updateTableData}
        />
      </div>
      <div className='container-fluid position-sticky bottom-0 bg-btn-container p-2'>
        <LogButtons
          onResetData={resetData}
          onNavSubmit={props.onNavSubmit}
          onSubmit={submitChanges}
        />
      </div>
    </>
  )
}