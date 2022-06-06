import React from 'react';

import { weightUnits, volumeUnits, round } from '../services/TableData';
import { validateInput, validateSelect } from '../services/Validation';

export const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
)

export function TextFilter({ column: { filterValue, preFilteredRows, setFilter, id: colId } }) {
  const count = preFilteredRows.length;

  return (
    <div className="text-filter">
      <input
        className="header-filter text-filter bg-white"
        value={filterValue || ''}
        onChange={e => {
          const val = e.target.value;
          const validated = validateInput(val, colId);
          if (validated) {
            setFilter(val || undefined)
          }
          
        }}
        onClick={e => {
          e.stopPropagation()
        }}
        placeholder={'Search...'}
      />
    </div>
  );
}

export function NumberRangeFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id: colId },
}) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[colId] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[colId] : 0
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[colId], min);
      max = Math.max(row.values[colId], max);
    })
    return [min, max];
  }, [colId, preFilteredRows])

  const [minValue, setMinValue] = React.useState('');
  const [maxValue, setMaxValue] = React.useState('');

  return (
    <>
      <div>
        <input
          className="bg-white" 
          style={{width: '60px'}}
          value={minValue}
          onChange={e => {
            const val = e.target.value
            const validated = validateInput(val, colId)
            if (validated) {
              setMinValue(val)
              setFilter((old = []) => [val ? parseFloat(val, 10) : undefined, old[1]])
            }
          }}
          onClick={e => e.stopPropagation()}
          placeholder={'Min'}
        />
      </div>
      <div>
        <input
          className="bg-white"
          style={{width: '60px'}}
          value={maxValue}
          onChange={e => {
            const val = e.target.value
            const validated = validateInput(val, colId)
            if (validated) {
              setMaxValue(val)
              setFilter((old = []) => [old[0], val ? parseFloat(val, 10) : undefined])
            }
          }}
          onClick={e => e.stopPropagation()}
          placeholder={'Max'}
        />
      </div>
    </>
  );
}

export const CalculatedCell = ({
  column: { id: colId },
  row: { index, original },
	data, 
  entries,
  updateTableData
}) => {
  let amount = original.amount;
  let unit = original.amount_unit;

  const [originalEntry, originalValue] = React.useMemo(
    () => {
      if (entries?.[index]) {
        return [entries[index], entries[index][colId]]
      }
      return [{}, '']
    }, [entries]
  )

  const value = React.useMemo(() => {
    let result = '';
    let servings = 0;

    if (!['', undefined].includes(originalValue)) {
      if (amount && originalEntry) {
        if (unit === 'servings') {
          servings = amount;
        } else if (unit === originalEntry.weight_unit && originalEntry.serving_by_weight !== '') {
          servings = amount / originalEntry.serving_by_weight;
        } else if (unit === originalEntry.volume_unit && originalEntry.serving_by_volume !== '') { 
          servings = amount / originalEntry.serving_by_volume;
        } else if (unit === 'items') {
          servings = amount / originalEntry.serving_by_item;
        }

      let precision = colId === 'cost_per_serving' ? 2 : 1;
      result = round(Number(servings) * Number(originalValue), precision);
      result = isNaN(result) ? '' : result;
      }
    }

    return result;
  }, [amount, unit, originalEntry, originalValue])

  React.useEffect(() => {
		if (data[index][colId] !== value) {
			updateTableData(index, colId, value);
		}
  }, [value, original])

  return (
    <div className='d-flex justify-content-center align-items-center'>
      {value}
    </div>
  );
}

export const Input = ({
  value: initialCellValue,
  column: { id: colId },
  row: { index, original },
  data, 
  entries,
  status,
  updateEditedRowIndices,
  updateTableData,
}) => {

  const [value, setValue] = React.useState(initialCellValue);
  const [isEdited, setIsEdited] = React.useState(false);

  const [originalEntry, originalValue] = React.useMemo(
    () => {
      if (entries?.[index]) {
        return [entries[index], entries[index][colId]]
      }
      return [{}, '']
    }, [entries]
  )

  React.useEffect(() => {
    setValue(initialCellValue);
    
    // Highlight flashes briefly upon new date submission due to offset in state update.
    // Equal length between data and entries ensures the state has fully updated.
    if (data.length === entries.length) {
      if (String(initialCellValue) === String(originalValue) || original.isPlaceholder) { 
        setIsEdited(false);
      } else {
        setIsEdited(true);
      }
    }
  }, [initialCellValue, original.amount_unit, entries]);

	React.useEffect(() => {
    // In the case of user removal of corresponding index unit
    if (colId === 'amount' && original.reset) {
      updateEditedRowIndices(index, 'add');
      updateTableData(index, colId, '')
    }
  }, [original.amount_unit])

  const onChange = e => {
    let newValue = e.target.value;
    let validated = validateInput(newValue, colId);

    if (validated) {
      setValue(newValue);

      if (status !== 'createLog' && typeof original.id !== 'undefined') {
        if ((String(newValue) !== String(originalValue)) && !isEdited) {
          updateEditedRowIndices(index, 'add');
          setIsEdited(true);
        } else if ((String(newValue) === String(originalValue)) && isEdited) {
          updateEditedRowIndices(index, 'remove');
          setIsEdited(false);
        }
      }

      updateTableData(index, colId, newValue);
    }
  }

  let divClassName = 'cell-container d-flex justify-content-center align-items-center';
	if (isEdited) {
		divClassName += ' bg-cell-edit';
	}

  let inputClassName =`h-75 p-0 m-0 border-0`;

	if (colId === 'name') {
		inputClassName += ' text-left'
	} else {
		inputClassName += ' text-center'
	}

  return (
		<>
			<div className={divClassName}>
				{!original.isPlaceholder &&
					<input className={inputClassName}
						style={colId==='name' ? {} : {width: '40px'}}
						value={value} onChange={onChange} />
				}
			</div>
		</>
  );
}

export const Select = ({
  value: initialCellValue,
  row: { index, original },
  column: { id: colId },
  data,
  entries,
  status,
  updateEditedRowIndices,
  updateTableData,
}) => {

  const [value, setValue] = React.useState(initialCellValue);
  const [isEdited, setIsEdited] = React.useState(false);

  const [originalEntry, originalValue] = React.useMemo(
    () => {
      if (entries?.[index]) {
        return [entries[index], entries[index][colId]]
      }
      return [{}, '']
    }, [entries]
  )

  const amountUnits = [
    'servings',
    ...(original.weight_unit ? [original.weight_unit] : []),
    ...(original.volume_unit ? [original.volume_unit] : []),
    ...(original.serving_by_item ? ['items'] : []),
  ];

	React.useEffect(() => {
    if (colId === 'amount_unit' && ![...amountUnits, '---'].includes(initialCellValue)) {
      updateEditedRowIndices(index, 'add');
      setValue("---")
      updateTableData(index, colId, "---");
			updateTableData(index, 'reset', true);
    } else {
      setValue(initialCellValue);
    }

    if (data.length === entries.length) {
      if (String(initialCellValue) === String(originalValue)) {
        setIsEdited(false);
      } else {
        setIsEdited(true);
      }
    }
  }, [initialCellValue, entries])

  let units = (colId === 'amount_unit')
  ? amountUnits 
  : colId === 'weight_unit' 
    ? weightUnits
    : volumeUnits;

  const onChange = e => {
    let newValue = e.target.value;
    let validated = validateSelect(newValue, colId, amountUnits);

    if (validated) {
      setValue(newValue);

      if (status !== 'createLog' && typeof original.id !== 'undefined') {
        if ((String(newValue) !== String(originalValue)) && !isEdited) {
          updateEditedRowIndices(index, 'add');
          setIsEdited(true);
        } else if ((String(newValue) === String(originalValue)) && isEdited) {
          updateEditedRowIndices(index, 'remove');
          setIsEdited(false);
        }
      }
  
      updateTableData(index, colId, newValue);
    }
  }

	let divClassName = 'cell-container d-flex justify-content-center align-items-center p-2 m-0';
  if (isEdited) {
		divClassName += ' bg-cell-edit'
	}

	return (
		<>
			<div className={divClassName}>
				{!original.isPlaceholder &&
					<select className={ `${colId} p-0` } value={value} onChange={onChange}
						style={(colId === 'amount_unit' ? {width: '85px'} : {...(colId==='weight_unit' ? {width: '50px'} : {width: '60px'})})}>
						{(colId!=='amount_unit' || value==="---") ? <option key='0' value=''>---</option> : null}
						{units.map((unit, i) => {
							return <option key={i} value={unit}>{unit}</option>
						})}
					</select>
				}
			</div>
		</>
  );
}

export const IndexCostCell = ({
  row: { original }
}) => {

  let servingsPerContainer = original.servings_per_container
  let costPerContainer = original.cost_per_container

  const value = React.useMemo(() => {
    let result = '';
    if (costPerContainer && servingsPerContainer) {
      result = round((costPerContainer / servingsPerContainer), 2)
    }

    return result;
  }, [servingsPerContainer, costPerContainer])

  return (
    <div className = 'cell-container d-flex justify-content-center align-items-center'>
      {value}
    </div>
  )
}

export const SumFooter = ({
  state: { selectedRowIds },
  preFilteredFlatRows,
  data,
  status,
  column: { id: colId }
}) => {

  const total = React.useMemo(
    () =>
      data.reduce((sum, row) => Number(row[colId]) + sum, 0),
      [data]
  )
  const selectedTotal = React.useMemo(
    () => {
      let selectedRows = preFilteredFlatRows.filter((row) => Object.keys(selectedRowIds).includes(row.id));
      let selectedTotal = selectedRows.reduce((sum, row) => Number(row.values[colId]) + sum, 0);
      return selectedTotal;
    }, [selectedRowIds, data]
  )

	let selectedTotalDivClassName = 'py-2';
  let totalDivClassName = 'py-2';

  if (status === 'logs') {
    selectedTotalDivClassName += ' border-bottom'
  }

  const emptyFooterIds = ['amount', 'amount_unit', 'name']
  let showTotal = !emptyFooterIds.includes(colId)

  return (
    <>
      <div className={selectedTotalDivClassName}>
        {(showTotal && String(round(selectedTotal, 1))) || (colId==='name' && 'Selected Total') || '---'}
      </div>
      {status === 'logs' && 
        <div className={totalDivClassName}>
          {(showTotal && String(round(total, 1))) || (colId==='name' && 'Total') || '---'}
        </div>}
    </>
  )
}
