import React from 'react';
import { useTable, useRowSelect, useSortBy, useFilters } from 'react-table';

import AddLogButtons from './buttons/AddLogButtons';
import { getEntries, createEntries } from '../services/EntryService';
import { getFormattedDate, prepareForAddLogTable } from '../services/TableData';
import { IndeterminateCheckbox, AddLogCell, AddLogAmountInput, NumberRangeFilter, AddLogSelect,
  TextFilter } from './SharedTableComponents';

function Table({ columns, data, dbData, updateSelectedEntries, updateTableData }) {

  const defaultColumn = React.useMemo(
    () => ({
      Cell: AddLogCell,
      disableFilters: true
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
    <p>Select which entries to add, and give an amount.</p>
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

export default function AddLogTable(props) {
  let userId = props.userId;
  let date = props.date;
  
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
        Cell: AddLogAmountInput
      },
      {
        Header: 'Unit',
        accessor: 'amount_unit',
        Cell: AddLogSelect
      },
       {
        Header: 'Calories',
        accessor: 'calories',
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
        accessor: 'trans_fat',
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
  const [dbData, setDbData] = React.useState([]);
  const [selectedEntries, setSelectedEntries] = React.useState([]);

  const fetchEntries = () => {
    const url = `/api/${userId}/index`;

    getEntries(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return {entries: []};
        }
      })
      .then((body) => {
        const entries = body.entries;
        const preparedEntries = prepareForAddLogTable(entries);
        console.log(preparedEntries)
        setData(preparedEntries);
        setDbData(preparedEntries);
      })
      .catch(err => {
        console.log('log table error: ', err)
      })
  }

  React.useEffect(() => {
    fetchEntries();
  }, [])

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

  const submitChanges = () => {
    console.log('submitted')
  }

  const updateSelectedEntries = (flatRows) => {
    setSelectedEntries(flatRows);
  }

  const resetData = () => {
    setData(dbData);
  }
  
  return (
    <>
      <div className='container-fluid p-3'>
        <Table
          columns={columns}
          data={data}
          dbData={dbData}
          updateSelectedEntries={updateSelectedEntries}
          updateTableData={updateTableData}
        />
      </div>
      <div className='container-fluid position-sticky bottom-0 bg-btn-container p-2'>
        <AddLogButtons
          onResetData={resetData}
          onNavSubmit={props.onNavSubmit}
          onSubmit={submitChanges}
        />
      </div>
    </>
  )
}