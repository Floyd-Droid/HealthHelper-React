import React, { useContext } from 'react';

import { createEntries, updateEntries, deleteEntries, getEntries } from '../../services/EntryService';
import { newIndexRow, prepareEntries } from '../../services/TableData';
import { validateIndexSubmission} from '../../services/Validation';

import GlobalContext from '../../context/GlobalContext';
import Table from './Table';
import TableButtons from './TableButtons';
import { Checkbox, IndexCostCell, Input, NumberRangeFilter, Select,
  TextFilter, ToggleAllCheckbox } from './SharedTableComponents';

export default function IndexTable(props) {
	const { user, isUserLoading, isBodyLoading, setIsBodyLoading, updateMessages } = useContext(GlobalContext);
  const status = props.status;
	const url = '/api/index';

	const [data, setData] = React.useState([]);
  const [entries, setEntries] = React.useState([]);
  const [editedEntryIds, setEditedEntryIds] = React.useState([]);
  const [skipFiltersReset, setSkipFiltersReset] = React.useState(true);
	const [sortState, setSortState] = React.useState({colId: '', desc: false});

	const defaultColumn = React.useMemo(
    () => ({
      Cell: Input,
      Filter: NumberRangeFilter,
      filter: 'between'
    }),
    []
  );

  const columns = React.useMemo(
    () => [
			{
        Header: ToggleAllCheckbox,
        accessor: 'isSelected',
        disableFilters: true,
        Cell: Checkbox
      },
      {
        Header: () => <div className='mb-4'>Name</div>,
        accessor: 'name',
        Filter: TextFilter,
        filter: 'basic'
      },
      {
        Header: <div className='mb-5'>Serving (Weight)</div>,
        accessor: 'serving_by_weight',
        disableFilters: true
      },
      {
        Header: <div className='mb-5'>Weight Unit</div>,
        accessor: 'weight_unit',
        Cell: Select,
        disableFilters: true
      },
      {
        Header: <div className='mb-5'>Serving (Volume)</div>,
        accessor: 'serving_by_volume',
        disableFilters: true
      },
      {
        Header: <div className='mb-5'>Volume Unit</div>,
        accessor: 'volume_unit',
        Cell: Select,
        disableFilters: true
      },
      {
        Header: <div className='mb-5'>Serving (Item)</div>,
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
  );

	const updateTableEntries = (potentialData, potentialEntries) => {
		if (potentialData.length) {
			setEntries(potentialEntries);
			setData(potentialData);
		} else {
			setEntries([newIndexRow]);
			setData([newIndexRow]);
		}
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
    );
  }

  const updateEditedEntryIds = (rowId, action) => {
    if (action === 'add') {
      setEditedEntryIds(old => [...old, rowId]);
    } else if (action === 'remove') {
      const idsCopy = [...editedEntryIds];
      idsCopy.splice(idsCopy.indexOf(rowId), 1);
      setEditedEntryIds(idsCopy);
    }
  }

	const addNewRow = () => {
		updateMessages({});
		const newRow = newIndexRow;
		setData(old => [...old, newRow]);
		setEntries(old => [...old, newRow]);
  }
  
  const resetData = () => {
		setEditedEntryIds([]);
		updateMessages({});
		setSkipFiltersReset(false);
    setData(entries);
  }

  const fetchEntries = async () => {
		const tokenResult = await user.getIdToken(true);
		const body = await getEntries(url, tokenResult);

		if (typeof body.errorMessage !== 'undefined') {
			updateMessages(body);
		}
			
		const preparedEntries = prepareEntries(body.entries || [], status);
		updateTableEntries(preparedEntries, preparedEntries);
		setIsBodyLoading(false);
  }

	const submitChanges = async () => {
		const editedEntries = [];
    const newEntries = [];

    const validationErrors = validateIndexSubmission(data);

		if (validationErrors.length) {
			updateMessages({validationMessages: validationErrors});
			setIsBodyLoading(false);
			return false;
		}

    // remove duplicate ids in the case of multiple edits per entry
    const dedupedEntryIds = [...new Set(editedEntryIds)];

		for (const entry of data) {
			if (typeof entry.isNew !== 'undefined') {
				newEntries.push(entry);
			} else if (dedupedEntryIds.includes(entry.id)) {
				editedEntries.push(entry);
			}
		}

		if (!(newEntries.length || editedEntries.length)) {
			updateMessages({});
			return false;
		}
		
		setIsBodyLoading(true);

		const token = await user.getIdToken(true);

		const editBody = editedEntries.length ? await updateEntries(url, token, editedEntries) : {};
		const createBody = newEntries.length ? await createEntries(url, token, newEntries) : {};

		updateMessages(editBody, createBody);
		setEditedEntryIds([]);
		fetchEntries();
	}

	const deleteRows = async () => {
		setIsBodyLoading(true);
		
    const selectedExistingEntries = [];
    const dataCopy = [...data];
    const entriesCopy = [...entries];

		for (const entry of [...data].reverse()) {
			if (entry.isSelected) {
				if (typeof entry.id !== 'undefined') {
					selectedExistingEntries.push({
						id: entry.id,
						name: entry.name
					});	
				}

				const rowIndex = data.indexOf(entry);

				dataCopy.splice(rowIndex, 1);
				entriesCopy.splice(rowIndex, 1);
			}
		}

		updateTableEntries(dataCopy, entriesCopy);
		
    if (selectedExistingEntries.length) {
			const tokenResult = await user.getIdToken(true);
			const body = await deleteEntries(url, tokenResult, selectedExistingEntries);
			updateMessages(body);
		} else {
			updateMessages({});
		}

		setIsBodyLoading(false);
	}

	const sortData = (colId) => {
		const dataCopy = [...data];
		const sortedEntries = [];

		const descending = sortState.colId === colId ? !sortState.desc : false;
		setSortState({colId: colId, desc: descending})

		if (colId === 'name') {
			dataCopy.sort((a, b) => {
				const comp = a[colId] > b[colId];
				return (comp && !descending) ? 1 : -1;
			})
		} else {
			dataCopy.sort((a, b) => {
				if (a[colId] === '') return 1;
				if (b[colId] === '') return -1;

				const comp = parseFloat(a[colId]) - parseFloat(b[colId]);
				return descending ? (comp * -1) : comp;
			})
		}

		for (const dataRow of dataCopy) {
			const dataId = dataRow.id;

			for (const entry of entries) {
				if (entry.id === dataId) {
					sortedEntries.push(entry);
					break;
				}
			}
		}

		setEntries(sortedEntries);
		setData(dataCopy);
	}

	const toggleAllRowsSelected = (toggle) => {
		setData(old =>
      old.map((row) => {
				return {
					...row,
					'isSelected': toggle,
				};
			})
    );
	}

  React.useEffect(() => {
		setSkipFiltersReset(true);
  }, [data])

  React.useEffect(() => {
		if (!isUserLoading && user) {
			fetchEntries();
		}
  }, [isUserLoading]);

	if (!isBodyLoading) {
		return (
			<>
				<div className='index-table-container'>
					<Table
						columns={columns}
						data={data}
						defaultColumn={defaultColumn}
						entries={entries}
						skipFiltersReset={skipFiltersReset}
						sortData={sortData}
						status={status}
						toggleAllRowsSelected={toggleAllRowsSelected}
						updateEditedEntryIds={updateEditedEntryIds}
						updateTableData={updateTableData}
					/>
				</div>
				<div className='container-fluid table-button-container position-sticky bottom-0 d-flex justify-content-center p-0'>
					<TableButtons
						data={data}
						status={status}
						onAddNewRow={addNewRow}
						onDeleteRows={deleteRows}
						onResetData={resetData}
						onSubmit={submitChanges}
					/>
				</div>
			</>
		);
	}
	return null;
}
