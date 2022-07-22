import React, { useRef } from 'react';

import { weightUnits, volumeUnits, round } from '../../services/TableData';
import { validateInput, validateSelect } from '../../services/Validation';

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

export function TextFilter({ column: { filterValue, setFilter, id: colId } }) {

  return (
    <div className="text-filter">
      <input
        className="header-filter text-filter bg-white"
        value={filterValue || ''}
        onChange={e => {
          const val = e.target.value;
          const validated = validateInput(val, colId);
          if (validated) {
            setFilter(val || undefined);
          }
        }}
        onClick={e => {
          e.stopPropagation();
        }}
        placeholder={'Search...'}
      />
    </div>
  );
}

export function NumberRangeFilter({
  column: { filterValue = [], setFilter, id: colId },
	autoResetFilters
}) {
  const [minValue, setMinValue] = React.useState('');
  const [maxValue, setMaxValue] = React.useState('');

	React.useEffect(() => {
		if (autoResetFilters) {
			setMinValue('');
			setMaxValue('');
		}
	}, [autoResetFilters])

  return (
    <>
      <div className='my-1'>
        <input
          className="bg-white" 
          style={{width: '3em'}}
          value={minValue}
          onChange={e => {
            const val = e.target.value;
            const validated = validateInput(val, colId);
            if (validated) {
              setMinValue(val)
							if (Number(val) <= Number(maxValue) || Number(maxValue) === 0) {
								setFilter((old = []) => [val ? parseFloat(val, 10) : undefined, old[1]]);
							} else if (Number(val) > Number(maxValue)) {
								setFilter((old = []) => [undefined, old[1]]);
							}
            }
          }}
          onClick={e => e.stopPropagation()}
          placeholder={'Min'}
        />
      </div>
      <div className='my-1'>
        <input
          className="bg-white"
          style={{width: '3em'}}
          value={maxValue}
          onChange={e => {
            const val = e.target.value;
            const validated = validateInput(val, colId);
            if (validated) {
              setMaxValue(val);
							if (Number(val) >= Number(minValue) || Number(minValue) === 0) {
								setFilter((old = []) => [old[0], val ? parseFloat(val, 10) : undefined]);
							} else if (Number(val) < Number(minValue)) {
								setFilter((old = []) => [old[0], undefined]);
							}
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
  entries,
  updateTableData
}) => {

  let amount = original.amount;
  let unit = original.amount_unit;

  const [originalEntry, originalValue] = React.useMemo(
    () => {
      if (entries?.[index]) {
        return [entries[index], entries[index][colId]];
      }
      return [{}, ''];
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

      const precision = colId === 'cost_per_serving' ? 2 : 1;
      result = round(Number(servings) * Number(originalValue), precision);
      result = isNaN(result) ? '' : result;
      }
    }

    return result;
  }, [amount, unit, originalEntry, originalValue])

  React.useEffect(() => {
		if (original[colId] !== value) {
			updateTableData(index, colId, value);
		}
  }, [value, original])

  return ( 
		<div className='d-flex justify-content-center align-items-center text-white'>
			{value}
		</div>
  );
}

export const Input = ({
  value: initialCellValue,
  column: { id: colId },
  row: { index, original },
  entries,
  status,
  updateEditedRowIndices,
  updateTableData,
}) => {

  const [value, setValue] = React.useState(initialCellValue);
  const [isEdited, setIsEdited] = React.useState(false);

	let autoFocus = false;
	const inputEl = useRef(null);

  const [originalEntry, originalValue] = React.useMemo(
    () => {
      if (entries?.[index]) {
        return [entries[index], entries[index][colId]];
      }
      return [{}, ''];
    }, [entries]
  )

  const onChange = e => {
    const newValue = e.target.value;
    const validated = validateInput(newValue, colId);

    if (validated) {
      setValue(newValue);

      if (status !== 'createLog' && !original.isNew) {
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

	React.useEffect(() => {
    setValue(initialCellValue);

		if ((String(initialCellValue) !== String(originalValue) || original.isNew || original.isReset) && status !== 'createLog') {
			setIsEdited(true);
		} else {
			setIsEdited(false);
		}
  }, [initialCellValue, originalValue, original.isNew, original.isReset]);

	React.useEffect(() => {
    // In the case of user removal of corresponding index unit
    if (colId === 'amount' && original.isReset) {
      updateEditedRowIndices(index, 'add');
      updateTableData(index, colId, '');
    }
  }, [original.isReset])

  let divClassName = 'cell-container d-flex justify-content-center align-items-center';
	let inputClassName ='table-cell-input';

	if (isEdited) {
		divClassName += ' bg-cell-edit';
		inputClassName += ' text-black';
	} else {
		inputClassName += ' text-white';
	}

	if (colId === 'name') {
		inputClassName += ' text-left';
		if (original.isNew) {
			autoFocus = true;
		}
	} else {
		inputClassName += ' text-center';
	}

	React.useEffect(() => {
		if (colId === 'name' && original.isNew) {
			inputEl.current.scrollIntoView({block: 'center'});
		}
	}, [original.isNew]) 

  return (
		<>
			<div className={divClassName}>
				{!original.isPlaceholder &&
					<input className={inputClassName}
					ref={inputEl}
					autoFocus={autoFocus}
					style={colId==='name' ? {} : {width: '3em'}}
					value={value} onChange={onChange}/>
				}
			</div>
		</>
  );
}

export const Select = ({
  value: initialCellValue,
  row: { index, original },
  column: { id: colId },
  entries,
  status,
  updateEditedRowIndices,
  updateTableData,
}) => {

	let units = [];
  const [value, setValue] = React.useState(initialCellValue);
  const [isEdited, setIsEdited] = React.useState(false);

	if (colId === 'amount_unit') {
		units = [
			'servings',
			...(original.weight_unit ? [original.weight_unit] : []),
			...(original.volume_unit ? [original.volume_unit] : []),
			...(original.serving_by_item ? ['items'] : []),
		];
	} else {
		units = colId === 'weight_unit' ? weightUnits : volumeUnits;
	}

  const [originalEntry, originalValue] = React.useMemo(
    () => {
      if (entries?.[index]) {
        return [entries[index], entries[index][colId]];
      }
      return [{}, ''];
    }, [entries]
  )

	React.useEffect(() => {
    setValue(initialCellValue);

		if ((String(initialCellValue) !== String(originalValue) || original.isNew || original.isReset) && status !== 'createLog') {
			setIsEdited(true);
		} else {
			setIsEdited(false);
		}
  }, [initialCellValue, originalValue, original.isNew, original.isReset])

	React.useEffect(() => {
    if (colId === 'amount_unit' && ![...units, '---'].includes(initialCellValue)) {
      updateEditedRowIndices(index, 'add');
      updateTableData(index, colId, "---");
			updateTableData(index, 'isReset', true);
    }
  }, [entries, initialCellValue])

  const onChange = e => {
    const newValue = e.target.value;
    const validated = validateSelect(newValue, colId, units);

    if (validated) {
      setValue(newValue);

      if (status !== 'createLog' && !original.isNew) {
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

	let divClassName = 'cell-container select-container d-flex justify-content-center align-items-center';
  if (isEdited) {
		divClassName += ' bg-cell-edit';
	}

	return (
		<>
			<div className={divClassName}>
				{!original.isPlaceholder &&
					<select className={ `${colId}` } value={value} onChange={onChange}
						style={(colId === 'amount_unit' ? {width: '7em'} : {...(colId==='weight_unit' ? {width: '4em'} : {width: '5em'})})}>
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
	column: { id: colId },
  row: { original, index },
	updateTableData
}) => {

  let servingsPerContainer = original.servings_per_container;
  let costPerContainer = original.cost_per_container;

  const value = React.useMemo(() => {
    let result = '';

    if (costPerContainer && servingsPerContainer) {
      result = round((costPerContainer / servingsPerContainer), 2);
    }

    return result;
  }, [servingsPerContainer, costPerContainer])

	let divClassName = 'cell-container input-container d-flex justify-content-center align-items-center';

	if (original.isNew) {
		divClassName += ' bg-cell-edit';
	}

	React.useEffect(() => {
		if (original[colId] !== value) {
			updateTableData(index, colId, value);
		}
  }, [value, original])

  return (
    <div className={divClassName} >
      <input className='table-cell-input border-0 text-white'
				disabled value={value} style={{width: '3em'}}>
			</input>
    </div>
  );
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

	let selectedTotalDivClassName = 'footer-container py-2';
  let totalDivClassName = 'footer-container py-2';

  const emptyFooterIds = ['amount', 'amount_unit', 'name'];
  const showTotal = !emptyFooterIds.includes(colId);
	const precision = colId === 'cost_per_serving' ? 2 : 1;

	return (
		<>
			<div className={selectedTotalDivClassName}>
				{(showTotal && String(round(selectedTotal, precision))) || (colId==='name' && 'Selected Total') || '---'}
			</div>
			{status === 'log' && 
				<div className={totalDivClassName}>
					{(showTotal && String(round(total, precision))) || (colId==='name' && 'Total') || '---'}
				</div>}
		</>
	);
}
