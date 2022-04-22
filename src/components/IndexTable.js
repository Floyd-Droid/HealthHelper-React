import React from 'react';
import { useTable, useRowSelect, usePagination, useSortBy, useFilters } from 'react-table';

import IndexButtons from './buttons/IndexButtons';
import { getEntries } from '../services/EntryService';
import { prepareForIndexTable } from '../services/TableData';
import { EditableInputCell, EditableSelectCell, IndeterminateCheckbox, 
  TextFilter, NumberRangeFilter} from './SharedTableComponents';

function Table({ columns, data, updateTableData, skipPageReset }) {

  const defaultColumn = React.useMemo(
    () => ({
      Cell: EditableInputCell,
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
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    state: { pageIndex, pageSize, selectedRowIds }
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      autoResetPage: !skipPageReset,
      autoResetFilters: false,
      autoResetSortBy: false,
      autoResetSelectedRows: false,
      updateTableData,
    },
    useFilters,
    useSortBy,
    usePagination,
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
      <table className="table table-bordered table-striped table-sm" {...getTableProps()}>
        <thead className="thead-dark">
          {headerGroups.map(headerGroup => (
            <tr className='header-row' {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th className="text-center" {...column.getHeaderProps(column.getSortByToggleProps())}
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
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '50px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}

export default function IndexTable(props) {
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
        Cell: EditableSelectCell,
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
        Cell: EditableSelectCell,
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
        Cell: ({ value }) => value
      },
    ],
    []
  )

  const [entries, setEntries] = React.useState([])
  const [data, setData] = React.useState([])
  const [originalData, setOriginalData] = React.useState([]);
  const [skipPageReset, setSkipPageReset] = React.useState(false);

  // Fetch the entries and set to state
  React.useEffect(() => {
    const url = `/api/${userId}/index`;

    getEntries(url)
      .then(entries => {
        setEntries(entries)
        const preparedEntries = prepareForIndexTable(entries)
        setData(preparedEntries)
        setOriginalData(preparedEntries)
      })
    }, [date]
  )

  const updateTableData = (rowIndex, columnId, value) => {
    setSkipPageReset(true);
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

  const resetData = () => setData(originalData)

  const addNewRow = () => {
    const newRow = {
      isNew: true,
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
    }

    setData(oldData => [newRow, ...oldData])
  }

  function validateServingSize() {
    // Ensure that at least one serving size section is filled out
    // Run this when submitting to the DB
    let table = document.getElementsByTagName('table')[0]

    for (let row of table.rows) {
      // Skip over the header row:
      if (row.className === 'header-row') {
        continue
      }

      const servWeight = row.getElementsByClassName('serving_by_weight')[0].value
      const weightUnit = row.getElementsByClassName('weight_unit')[0].value
      const servVolume = row.getElementsByClassName('serving_by_volume')[0].value
      const volumeUnit = row.getElementsByClassName('volume_unit')[0].value
      const servItem = row.getElementsByClassName('serving_by_item')[0].value

      if (!((servWeight && weightUnit) || (servVolume && volumeUnit) || servItem )) {
        // TODO - provide better message display
        alert(
          `Please fill in at least one of the serving size field sets for each entry:\n
          \u2022 Weight quantity and weight unit
          \u2022 Volume quantity and volume unit
          \u2022 Item quantity
          `)
      }
    }
  }

  const submitChanges = () => {
    validateServingSize()

    // TODO - PUT to DB
  }

  React.useEffect(() => {
    setSkipPageReset(false)
  }, [data])

  return (
    <>
      <Table
        columns={columns}
        data={data}
        updateTableData={updateTableData}
        skipPageReset={skipPageReset}
      />
      <IndexButtons
        onAddNewRow={addNewRow}
        onNavSubmit={props.onNavSubmit}
        onResetData={resetData}
        onSubmit={submitChanges}
      />
    </>
  )
}