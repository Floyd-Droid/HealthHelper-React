import React from 'react';
import { useTable, useRowSelect, useSortBy, useFilters } from 'react-table';

import IndexButtons from './buttons/IndexButtons';
import { createOrUpdateEntries, deleteEntries, getEntries } from '../services/EntryService';
import { prepareEntries } from '../services/TableData';
import { IndeterminateCheckbox, IndexCostCell, Input, NumberRangeFilter, Select,
  TextFilter } from './SharedTableComponents';

function Table({ columns, data, indexEntries, skipSelectedRowsReset, status, 
  updateEditedEntryIds, updateSelectedEntries, updateTableData }) {

  const defaultColumn = React.useMemo(
    () => ({
      Cell: Input,
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
    state: { selectedRowIds }
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      autoResetFilters: false,
      autoResetSortBy: false,
      autoResetSelectedRows: !skipSelectedRowsReset,
      indexEntries,
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
          Cell: ({row}) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns
      ])
    }
  )

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
      </table>
    </>
  )
}

export default function IndexTable(props) {
  let status = props.status;
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
        Cell: Select,
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
        Cell: Select,
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
        Cell: IndexCostCell
      },
    ],
    []
  )

  const [data, setData] = React.useState([])
  const [indexEntries, setIndexEntries] = React.useState([]);
  const [editedEntryIds, setEditedEntryIds] = React.useState([]);
  const [selectedEntries, setSelectedEntries] = React.useState([])
  const [skipSelectedRowsReset, setSkipSelectedRowsReset] = React.useState(true)

  const fetchEntries = () => {
    const url = `/api/${userId}/index`;

    getEntries(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return {entries: []}
        }
      })
      .then((body) => {
        const entries = body.entries;
        const preparedIndexEntries = prepareEntries(entries, status)
        setData(preparedIndexEntries)
        setIndexEntries(preparedIndexEntries)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  React.useEffect(() => {
    fetchEntries()
    }, []
  )

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
    if (action === 'add') {
      setEditedEntryIds(old => [...old, entryId])
    } else if (action === 'remove') {
      setEditedEntryIds(editedEntryIds.filter((id) => String(id) != String(entryId)))
    }
  }

  function validateServingSize() {
    for (let entry of data) {
      const servWeight = entry.serving_by_weight;
      const weightUnit = entry.weight_unit;
      const servVolume = entry.serving_by_volume;
      const volumeUnit = entry.volume_unit;
      const servItem = entry.serving_by_item;

      if (!((servWeight && weightUnit) || (servVolume && volumeUnit) || servItem )) {
        alert(
          `Please fill in at least one of the serving size field sets for each entry:\n
          \u2022 Weight quantity and weight unit
          \u2022 Volume quantity and volume unit
          \u2022 Item quantity
          `);
      }
    }
  }

  const submitChanges = () => {
    validateServingSize();

    const editedEntries = [];
    const newEntries = [];

    // Gather edited entries
    for (let id of editedEntryIds) {
      for (let entry of data) {
        if (entry.id === id) {
          editedEntries.push(entry);
        }
      }
    }

    // Gather new entries
    for (let newEntry of data.reverse()) {
      if (newEntry.id === undefined) {
        newEntries.push(newEntry);
      } else {
        break;
      }
    }

    if (editedEntries.length || newEntries.length) {
      let url = `api/${userId}/index`;

      createOrUpdateEntries(url, newEntries, editedEntries)
        .then(messages => {
          console.log(messages);
          fetchEntries();
        })
        .catch(err => console.log(err));
    }
  }

  const addNewRow = () => {
    const newRow = {
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
    };
    setData(old => [...old, newRow]);
  }

  const deleteRows = () => {
    const existingEntryIds = [];
    let dataCopy = [...data];

    for (let entry of selectedEntries.reverse()) {
      if (entry.original.id !== undefined) {
        existingEntryIds.push(entry.original.id)
      }
      dataCopy.splice(entry.index, 1)
    }

    setSkipSelectedRowsReset(false);
    setData(dataCopy);
    
    if (existingEntryIds.length) {
      const url = `/api/${userId}/index`;

      deleteEntries(url, existingEntryIds)
        .then((response) => {
          if (!response.ok) {
            console.log('Something went wrong when deleting index entries.');
          }
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }

  const updateSelectedEntries = (flatRows) => {
    setSelectedEntries(flatRows);
  }
  
  const resetData = () => {
    setData(indexEntries);
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
          skipSelectedRowsReset={skipSelectedRowsReset}
          status={status}
          updateEditedEntryIds={updateEditedEntryIds}
          updateSelectedEntries={updateSelectedEntries}
          updateTableData={updateTableData}
        />
      </div>
      <div className='container-fluid position-sticky bottom-0 bg-btn-container p-2'>
        <IndexButtons
          onAddNewRow={addNewRow}
          onDeleteRows={deleteRows}
          onNavSubmit={props.onNavSubmit}
          onResetData={resetData}
          onSubmit={submitChanges}
        />
      </div>
    </>
  )
}