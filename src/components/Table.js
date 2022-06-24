import React from 'react';
import { useTable, useRowSelect, useSortBy, useFilters } from 'react-table';

import { IndeterminateCheckbox } from './SharedTableComponents';


export default function Table({ columns, data, date, defaultColumn, entries, 
		skipSelectedRowsReset, status,updateEditedRowIndices, updateSelectedEntries,
		updateTableData, 
  }) {

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
		if (status === 'log') {
			toggleAllRowsSelected(false);
		}
  }, [date])

	React.useEffect(() => {
		toggleAllRowsSelected(false);
  }, [status])

  React.useEffect(() => {
    updateSelectedEntries(selectedRowIds)
  }, [selectedRowIds])

  return (
    <>
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
				{status !== 'index' &&
					<tfoot>
					{footerGroups.map(group => (
						<tr {...group.getFooterGroupProps()}>
							{group.headers.map(column => (
								<td className='bg-white text-center border-1 p-0 m-0' {...column.getFooterProps()}>{column.render('Footer')}</td>
							))}
						</tr>
					))}
					</tfoot>
				}
      </table>
    </>
  )
}