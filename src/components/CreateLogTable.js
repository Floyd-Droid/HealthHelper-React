import React from 'react';
import { useTable, useRowSelect, useSortBy, useFilters } from 'react-table';

import { getEntries, createEntries } from '../services/EntryService';
import { getFormattedDate, placeholderLogRow, prepareEntries } from '../services/TableData';

import CreateLogButtons from './buttons/CreateLogButtons';
import MessageContainer from './Messages';
import { CalculatedCell, IndeterminateCheckbox, Input, NumberRangeFilter, Select, SumFooter,
  TextFilter } from './SharedTableComponents';

	
function Table({ columns, data, entries, errorMessages, skipSelectedRowsReset, 
	successMessages, status, updateSelectedEntries, updateTableData }) {

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
    updateSelectedEntries(selectedRowIds)
  }, [selectedRowIds])

  return (
    <>
    	<p>Select which entries to add, and give an amount.</p>

			{successMessages.length > 0 && 
        <MessageContainer messages={successMessages} variant='success' type='success'/>}
      {errorMessages.length > 0 && 
        <MessageContainer messages={errorMessages} variant='danger' type='error'/>}

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
                <td className='bg-white text-center border-1 p-0 m-0' {...column.getFooterProps()}>{column.render('Footer')}</td>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </>
  )
}

export default function CreateLogTable(props) {
  const status = props.status;
  const userId = props.userId;
  const date = props.date;
  const formattedDate = getFormattedDate(date, 'url');
  
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
        Cell: Input,
        disableFilters: true
      },
      {
        Header: 'Unit',
        accessor: 'amount_unit',
        Cell: Select,
        disableFilters: true
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
  const [selectedEntries, setSelectedEntries] = React.useState({});
  const [skipSelectedRowsReset, setSkipSelectedRowsReset] = React.useState(true);
  const [errorMessages, setErrorMessages] = React.useState([]);
	const [successMessages, setSuccessMessages] = React.useState([]);

	const updateTableEntries = (potentialData, potentialEntries) => {
		if (potentialData.length) {
			setEntries(potentialEntries);
			setData(potentialData);
		} else {
			setEntries([placeholderLogRow]);
			setData([placeholderLogRow]);
		}
	}

	const updateMessages = (messages) => {
		setErrorMessages(messages.errorMessages);
		setSuccessMessages(messages.successMessages);
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

	const updateSelectedEntries = (selectedRowIds) => {
    setSelectedEntries(selectedRowIds);
  }

	const resetData = () => {
    setData(entries);
  }

  const fetchEntries = async () => {
    const url = `/api/${userId}/index`;

		try {
			const body = await getEntries(url);
			updateMessages(body);
			
			const preparedEntries = prepareEntries(body.entries, status);
			updateTableEntries(preparedEntries, preparedEntries);
		} catch(err) {
        console.log(err)
    }
  }

  const submitChanges = async () => {
    const entriesToCreate = [];

    for (const rowId of Object.keys(selectedEntries)) {
      entriesToCreate.push({
				amount: data[rowId].amount, 
				amount_unit: data[rowId].amount_unit,
        id: data[rowId].id, 
        name: data[rowId].name
      });
    }

    if (entriesToCreate.length) {
      const url = `/api/${userId}/logs?date=${formattedDate}`;

			try {
				const body = await createEntries(url, entriesToCreate);

				updateMessages(body);
				setSkipSelectedRowsReset(false);
				resetData();
			} catch(err) {
          console.log(err);
      }
    }
  }

  React.useEffect(() => {
    setSkipSelectedRowsReset(true)
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
          status={status}
          entries={entries}
          errorMessages={errorMessages}
          skipSelectedRowsReset={skipSelectedRowsReset}
					successMessages={successMessages}
          updateSelectedEntries={updateSelectedEntries}
          updateTableData={updateTableData}
        />
      </div>
      <div className='container-fluid position-sticky bottom-0 bg-btn-container p-2'>
        <CreateLogButtons
					data={data}
          onResetData={resetData}
          onNavSubmit={props.onNavSubmit}
          onSubmit={submitChanges}
        />
      </div>
    </>
  )
}