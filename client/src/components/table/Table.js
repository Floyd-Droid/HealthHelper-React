import React from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';


export default function Table({ columns, data, defaultColumn, entries,
		skipFiltersReset, sortData, status, toggleAllRowsSelected, updateEditedEntryIds, 
		updateTableData
  }) {

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    prepareRow,
    rows,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      autoResetFilters: !skipFiltersReset,
      autoResetSortBy: false,
      entries,
      status,
			toggleAllRowsSelected,
      updateEditedEntryIds,
      updateTableData,
    },
    useFilters,
    useSortBy,
  );

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
                <th className='header text-center text-white'
									{...column.getHeaderProps()}
										onClick={() => {
											sortData(column.id)
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
                  return <td className='text-center align-middle p-0' {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
				{ status !== 'index' &&
					<tfoot>
						{footerGroups.map(group => (
							<tr {...group.getFooterGroupProps()}>
								{group.headers.map(column => (
									<td className='footer text-white text-center p-0 m-0' {...column.getFooterProps()}>{column.render('Footer')}</td>
								))}
							</tr>
						))}
					</tfoot>
				}
      </table>
		</>
  );
}
