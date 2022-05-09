import React from 'react';

import {weightUnits, volumeUnits} from '../services/TableData';
import { round } from '../services/TableData';

export const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)

export function TextFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
  const count = preFilteredRows.length;

  return (
    <div className="text-filter">
      <input
        className="header-filter text-filter bg-white"
        value={filterValue || ''}
        onChange={e => {
          setFilter(e.target.value || undefined)
        }}
        onClick={e => {
          e.stopPropagation()
        }}
        placeholder={'Search...'}
      />
    </div>
  )
}

export function NumberRangeFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })
    return [min, max];
  }, [id, preFilteredRows])

  return (
    <>
      <div className="range-filter">
        <input
          className="header-filter range-filter bg-white" 
          style={{width: '60px'}}
          value={filterValue[0] || ''}
          type="number"
          onChange={e => {
            const val = e.target.value
            setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
          }}
          onClick={e => e.stopPropagation()}
          placeholder={`Min (${min})`}
        />
      </div>
      <div className="range-filter">
        <input
          className="header-filter range-filter bg-white"
          style={{width: '60px'}}
          value={filterValue[1] || ''}
          type="number"
          onChange={e => {
            const val = e.target.value
            setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
          }}
          onClick={e => e.stopPropagation()}
          placeholder={`Max (${max})`}
        />
      </div>
    </>
  )
}

export const CreateLogCell = ({
  row: { index, original },
  column: { id },
  dbData,
  updateTableData
}) => {

  let init, dbEntry, servings;
  for (let entry of dbData) {
    if (entry.id == original.id) {
      init = entry[id];
      dbEntry = entry
      break;
    }
  }

  const [initialValue, setInitialValue] = React.useState(init);
  const [value, setValue] = React.useState('');

  let amount = original.amount;
  let unit = original.amount_unit;
  let result = '';

  React.useEffect(() => {
    if (amount) {
      if (unit === 'servings') {
        servings = amount;
      } else if (unit === dbEntry.weight_unit) {
        servings = amount / dbEntry.serving_by_weight;
      } else if (unit === dbEntry.volume_unit) { 
        servings = amount / dbEntry.serving_by_volume;
      } else if (unit === 'items') {
        servings = amount / dbEntry.serving_by_item;
      }

      let precision = id === 'cost_per_serving' ? 2 : 1;
      result = round(Number(servings) * Number(init), precision);
    }

    setValue(result)
    updateTableData(index, id, result)
  }, [amount, unit])

  return (
    <div>
      {value}
    </div>
  );
}

export const CreateLogAmountInput = ({
  row: { index },
  column: { id },
  updateTableData,
}) => {

  const [value, setValue] = React.useState('');

  const onChange = e => {
    let newVal = e.target.value;
    setValue(newVal);
    updateTableData(index, id, newVal);
  }

  const inputClassName = `amount text-center p-0 m-0 border-0`;

  const input = (<input className={inputClassName}
    style={{width: '40px'}}
    value={value} onChange={onChange} />
  )

  return (
    <div className=''>
      {input}
    </div>
  )
}

export const CreateLogSelect = ({
  row: { index, original },
  column: { id },
  updateTableData,
}) => {

  const [value, setValue] = React.useState('servings');

  const units = [
    'servings',
    ...(original.weight_unit ? [original.weight_unit] : []),
    ...(original.volume_unit ? [original.volume_unit] : []),
    ...(original.serving_by_item ? ['items'] : []),
  ]

  const onChange = e => {
    let newVal = e.target.value
    setValue(newVal);
    updateTableData(index, id, newVal);
  }

  let unitSelect = (
    <select className='amount-unit' value={value} onChange={onChange}
      style={{width: '95px'}}>
      {units.map((unit, i) => {
        return <option key={i} value={unit}>{unit}</option>
      })}
    </select>
  )

  const selectDiv = (
    <div className='p-2 m-0'>
      {unitSelect}
    </div>
  )

  return selectDiv;
}

function validateInput(key, value) {
  let message = '';
  if (key === 'name') {
    message = value === '' ? 'Name is required': '';
    // handle duplicate names eventually
  } else if (isNaN(Number(value))){
    message = 'Must be a number';
  }
  return message;
}

export const Input = ({
  value: initialCellValue,
  row: { index, original },
  column: { id },
  dbData,
  updateEditedEntryIds,
  updateTableData,
}) => {

  let init;
  for (let entry of dbData) {
    if (entry.id == original.id) {
      init = entry[id];
      break;
    }
  }
  const [initialValue, setInitialValue] = React.useState('');
  const [value, setValue] = React.useState(initialCellValue);
  const [isEdited, setIsEdited] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const onChange = e => {
    let newVal = e.target.value;
    setValue(newVal);

    if (!original.isNew) {
      if ((String(newVal) !== String(initialValue)) && !isEdited) {
        updateEditedEntryIds(original.id, 'add');
        setIsEdited(true);
      } else if ((String(newVal) === String(initialValue)) && isEdited) {
        updateEditedEntryIds(original.id, 'remove');
        setIsEdited(false);
      }
    }

    const validationMessage = validateInput(id, newVal);
    if (validationMessage) {
      setErrorMessage(validationMessage);
    } else {
      setErrorMessage('');
    }

    updateTableData(index, id, newVal);
  }

  React.useEffect(() => {
    setInitialValue(init)
    setValue(initialCellValue);

    if (String(initialCellValue) === String(init)) {
      setIsEdited(false)
      setErrorMessage('')
    }
  }, [initialCellValue, init]);

  let inputClassName = id === 'name' ? `${id} text-left` : `${id} text-center`;
  inputClassName += ' p-0 m-0 border-0';

  let divClassName = '';

  if (isEdited && errorMessage) {
    divClassName += ' bg-cell-error';
  } else if (isEdited) {
    divClassName += ' bg-cell-edit';
  }

  const autoFocus = id === 'name' && original.isNew;

  const input = (<input className={inputClassName}
      {...(autoFocus ? {autoFocus} : {})}
      style={(id==='name' ? {} : {width: '40px'})}
      value={value} onChange={onChange} />
    )

  return (
    <div className={divClassName}>
      {input}
    </div>
  )
}

function validateSelect(key, value, amountUnits) {
  let message;
  if (key === 'amount_unit') {
    message = amountUnits.includes(value) ? '' : 'Select a valid unit';
  } else {
    let tmpUnits = key === 'weight_unit' ? [...weightUnits] : [...volumeUnits];
    tmpUnits.push('')
    message = tmpUnits.includes(value) ? '' : 'Select a valid unit';
  }
  return message;
}

export const Select = ({
  value: initialCellValue,
  row: { index, original },
  column: { id },
  dbData,
  updateEditedEntryIds,
  updateTableData,
}) => {

  let init;
  for (let entry of dbData) {
    if (entry.id == original.id) {
      init = entry[id]
      break;
    }
  }

  const [initialValue, setInitialValue] = React.useState('')
  const [value, setValue] = React.useState(initialCellValue);
  const [isEdited, setIsEdited] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('')

  const amountUnits = [
    'servings',
    ...(original.weight_unit ? [original.weight_unit] : []),
    ...(original.volume_unit ? [original.volume_unit] : []),
    ...(original.serving_by_item ? ['items'] : []),
  ]

  const onChange = e => {
    let newVal = e.target.value
    setValue(newVal);

    if (!original.isNew) {
      if (String(newVal) !== String(initialValue)) {
        updateEditedEntryIds(original.id, 'add')
        setIsEdited(true)
      } else if (String(newVal) === String(initialValue)) {
        updateEditedEntryIds(original.id, 'remove')
        setIsEdited(false)
      }
    }

    const validationMessage = validateSelect(id, newVal, amountUnits);
    if (validationMessage) {
      setErrorMessage(validationMessage);
    } else {
      setErrorMessage('');
    }

    updateTableData(index, id, newVal);
  }

  React.useEffect(() => {
    setValue(initialCellValue);
    setInitialValue(init)

    if (String(initialCellValue) === String(init)) {
      setIsEdited(false)
      setErrorMessage('')
    }
  }, [initialCellValue, init]);

  let units = (id === 'amount_unit')
    ? amountUnits 
    : id === 'weight_unit' 
      ? weightUnits
      : volumeUnits;
  
  let unitSelect = (
    <select className={ `${id}` } value={value} onChange={onChange}
      style={(id === 'amount_unit' ? {width: '85px'} : {...(id==='weight_unit' ? {width: '55px'} : {width: '75px'})})}>
      {id!=='amount_unit' ? <option key='0' value=''>---</option> : null}
      {units.map((unit, i) => {
        return <option key={i} value={unit}>{unit}</option>
      })}
    </select>
  )

  let divClassName = 'p-2 m-0';

  if (isEdited && errorMessage) {
    divClassName += ' bg-cell-error';
  } else if (isEdited) {
    divClassName += ' bg-cell-edit';
  }

  const selectDiv = (
    <div className={divClassName}>
      {unitSelect}
    </div>
  )

  return selectDiv;
}