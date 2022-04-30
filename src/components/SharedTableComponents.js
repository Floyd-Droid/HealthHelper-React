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
  value: initialValue,
  row: { index, original },
  column: { id },
  updateEditedEntryIds,
  updateTableData,
}) => {
  const [value, setValue] = React.useState(initialValue);
  const [isEdited, setIsEdited] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const onChange = e => {
    setValue(e.target.value);

    // Track the edited input values
    if ((String(e.target.value) !== String(initialValue)) && !isEdited) {
      updateEditedEntryIds(original.id, 'add')
      setIsEdited(true)
    } else if ((String(e.target.value) === String(initialValue)) && isEdited) {
      updateEditedEntryIds(original.id, 'remove')
      setIsEdited(false)
    }
  }

  const onBlur = () => {
    const validationMessage = validateInput(id, value);
    if (validationMessage) {
      setErrorMessage(validationMessage);
    } else {
      setErrorMessage('');
      updateTableData(index, id, value);
    }
  }

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

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
      value={value} onChange={onChange} onBlur={onBlur} />
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
    let units = key === 'weight_unit' ? weightUnits : volumeUnits;
    units.push('')
    message = units.includes(value) ? '' : 'Select a valid unit';
  }
  return message;
}

export const EditableSelectCell = ({
  value: initialValue,
  row: { index, original },
  column: { id },
  updateTableData,
}) => {
  
  const [value, setValue] = React.useState(initialValue);
  const [isEdited, setIsEdited] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('')

  const amountUnits = [
    ...(original.weight_unit ? [original.weight_unit] : []),
    ...(original.volume_unit ? [original.volume_unit] : []),
    ...(original.serving_by_item ? ['item(s)'] : []),
  ]

  const onChange = e => {
    setValue(e.target.value);

    if (String(e.target.value) !== String(initialValue)) {
      setIsEdited(true);
    } else {
      setIsEdited(false);
    }

    const validationMessage = validateSelect(id, e.target.value, amountUnits);
    if (validationMessage) {
      setErrorMessage(validationMessage);
    } else {
      setErrorMessage('');
    }
  }

  const onBlur = () => {
    if (!errorMessage) {
      updateTableData(index, id, value);  
    }
  }

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  let units = (id === 'amount_unit')
    ? amountUnits 
    : id === 'weight_unit' 
      ? weightUnits
      : volumeUnits;

  let unitSelect = (
    <select className={ `${id}` } value={value} onChange={onChange} onBlur={onBlur}
      style={(id === 'amount_unit' ? {width: '85px'} : {...(id==='weight_unit' ? {width: '55px'} : {width: '75px'})})}>
      {id!=='amount_unit' ? <option key='0' value=''>---</option> : null}
      {units.map((unit, i) => {
        return <option key={i + 1} value={unit}>{unit}</option>
      })}
    </select>
  )

  let divClassName = 'p-1';

  if (isEdited) {
    divClassName += ' bg-cell-edit'
  }

  const selectDiv = (
    <div className={divClassName}>
      <div className='m-0 p-0'>
        {unitSelect}
      </div>
      {errorMessage && <div className='error text-danger'>{errorMessage}</div>}
    </div>
  )

  return selectDiv;
}