import React from 'react';
import { useTable, useRowSelect, useSortBy, useFilters } from 'react-table';

import CreateLogButtons from './buttons/CreateLogButtons';
import { getEntries, createEntries } from '../services/EntryService';
import { getFormattedDate, prepareEntries } from '../services/TableData';
import { CalculatedCell, IndeterminateCheckbox, Input, NumberRangeFilter, Select, SumFooter,
  TextFilter } from './SharedTableComponents';

function Table({ columns, data, entries, skipSelectedRowsReset, status, 
  updateSelectedEntries, updateTableData }) {

  const defaultColumn = React.useMemo(
    () => ({
      Cell: CalculatedCell,
      disableFilters: true,
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
      entries,
      status,
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

export default function CreateLogTable(props) {
  let status = props.status;
  let userId = props.userId;
  let date = props.date;
  let formattedDate = getFormattedDate(date, 'url')
  
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        Filter: TextFilter,
        filter: 'basic',
        Cell: ({value}) => value,
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        Cell: Input
      },
      {
        Header: 'Unit',
        accessor: 'amount_unit',
        Cell: Select
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
  const [entries, setEntries] = React.useState([]);
  const [selectedEntries, setSelectedEntries] = React.useState([]);
  const [skipSelectedRowsReset, setSkipSelectedRowsReset] = React.useState(true)

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
        const indexEntries = body.entries;
        const preparedEntries = prepareEntries(indexEntries, status)
        setData(preparedEntries)
        setEntries(preparedEntries);
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
    const entriesToCreate = [];

    for (let entry of selectedEntries) {
      let newEntry = {
        id: Number(entry.original.id), 
        amount: Number(entry.values.amount), 
        amount_unit: String(entry.values.amount_unit)
      }
      entriesToCreate.push(newEntry)
    }

    if (entriesToCreate.length) {
      let url = `/api/${userId}/logs?date=${formattedDate}`;
      createEntries(url, entriesToCreate)
        .then(response => {
          if (response.ok) {
            setSkipSelectedRowsReset(false);
            resetData();
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  const updateSelectedEntries = (flatRows) => {
    setSelectedEntries(flatRows);
  }

  const resetData = () => {
    setData(entries);
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
          status={status}
          entries={entries}
          skipSelectedRowsReset={skipSelectedRowsReset}
          updateSelectedEntries={updateSelectedEntries}
          updateTableData={updateTableData}
        />
      </div>
      <div className='container-fluid position-sticky bottom-0 bg-btn-container p-2'>
        <CreateLogButtons
          onResetData={resetData}
          onNavSubmit={props.onNavSubmit}
          onSubmit={submitChanges}
        />
      </div>
    </>
  )
}