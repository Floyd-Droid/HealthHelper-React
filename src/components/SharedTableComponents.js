import React from 'react';

import {weightUnits, volumeUnits} from '../services/TableData';

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

function validateInput(key, value) {
  // 'name' field is required. All else must be numbers
  let message = '';
  if (key === 'name') {
    message = value === '' ? 'Name is required': '';
    // handle duplicate names eventually
  } else if (isNaN(Number(value))){
    message = 'Must be a number';
  }
  return message;
}

export const EditableInputCell = ({
  value: initialCellValue,
  row: { index, original },
  column: { id },
  dbData,
  updateEditedEntryIds,
  updateTableData,
}) => {

  // var: original - the entry data currently held in the react-table
  // var: initialCellValue - the initial value of the cell based on data passed to react-table
  // var: dbData - the entry data from the last database fetch

  // Find the corresponding value from the last fetch (the true initial value)
  let init;
  for (let entry of dbData) {
    if (entry.id == original.id) {
      init = entry[id]
      break;
    }
  }

  // var: initialValue - the initial value from the last database fetch
  const [initialValue, setInitialValue] = React.useState('')

  const [value, setValue] = React.useState(initialCellValue);
  const [isEdited, setIsEdited] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const onChange = e => {
    let newVal = e.target.value
    setValue(newVal);

    // Track the edited entries by id
    if ((String(newVal) !== String(initialValue)) && !isEdited) {
      updateEditedEntryIds(original.id, 'add')
      setIsEdited(true)
    } else if ((String(newVal) === String(initialValue)) && isEdited) {
      updateEditedEntryIds(original.id, 'remove')
      setIsEdited(false)
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
  inputClassName += ' p-0 m-0 border-0'

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

export const EditableSelectCell = ({
  value: initialCellValue,
  row: { index, original },
  column: { id },
  dbData,
  updateEditedEntryIds,
  updateTableData,
}) => {

  // Find the original value from the last fetch
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
    ...(original.weight_unit ? [original.weight_unit] : []),
    ...(original.volume_unit ? [original.volume_unit] : []),
    ...(original.serving_by_item ? ['item(s)'] : []),
  ]

  const onChange = e => {
    let newVal = e.target.value
    setValue(newVal);

    // Track the edited entries by id
    if (String(newVal) !== String(initialValue)) {
      updateEditedEntryIds(original.id, 'add')
      setIsEdited(true)
    } else if (String(newVal) === String(initialValue)) {
      updateEditedEntryIds(original.id, 'remove')
      setIsEdited(false)
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