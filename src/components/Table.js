import React from 'react';
import { useTable, useRowSelect, useSortBy, useFilters } from 'react-table';

import { IndeterminateCheckbox } from './SharedTableComponents';


export default function Table({ columns, data, date, defaultColumn, entries,
		showFooter, skipFiltersReset, skipSelectedRowsReset, sortData, status, 
		updateEditedRowIndices, updateSelectedEntries, updateTableData
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
      defaultColumn,
      autoResetFilters: !skipFiltersReset,
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
            <div className='d-flex align-middle justify-content-center'>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
          Footer: () => {
						return (
							<>
								<div className='footer-container text-footer py-2'>
								{'-'}
								</div>
								{status === 'log' && 
									<div className='footer-container text-footer py-2'>
										{'-'}
									</div>}
							</>
						)
					}
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
			{status === 'createLog' &&
				<p className='text-white'>
					Select some entries, and give each an amount. 
					Then submit your changes to add the entries to 
					the log associated with the date above.
				</p>
			}
      <table className='table table-sm position-relative' {...getTableProps()}>
        <thead className='thead-dark align-end'>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th className='text-center text-white position-sticky top-56 bg-header'
									{...column.getHeaderProps(column.getSortByToggleProps())}
										onClick={() => {
											if (column.canSort) {
												sortData(column.id)
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
                  return <td className='text-center align-middle p-0 ' {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
				{(status !== 'index' && showFooter) &&
					<tfoot>
						{footerGroups.map(group => (
							<tr {...group.getFooterGroupProps()}>
								{group.headers.map(column => (
									<td className='bg-footer text-white text-center p-0 m-0 position-sticky bottom-50' {...column.getFooterProps()}>{column.render('Footer')}</td>
								))}
							</tr>
						))}
					</tfoot>
				}
      </table>
		</>
  )
}