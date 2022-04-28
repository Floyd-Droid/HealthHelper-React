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
        className="header-filter text-filter"
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
          className="header-filter range-filter" 
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
          className="header-filter range-filter"
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
    } else if ((String(e.target.value) !== String(initialValue)) && isEdited) {
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

  let inputClassName = id === 'name' ? `${id} cell-input text-left` : `${id} cell-input num-input text-center`;
  inputClassName += ' p-0 m-0 border-0'  //bg-inherit

  let divClassName = isEdited ? 'cell-input-wrapper bg-primary' : 'cell-input-wrapper'

  

  let input = (<input className={inputClassName} style={id==='name' ? {} : {width: '40px'}} 
    value={value} onChange={onChange} onBlur={onBlur} />
  )

  let newNameInput = (<input className={inputClassName} autoFocus
     value={value} onChange={onChange} onBlur={onBlur} />
  )

  return (
    <div className='cell-wrapper'>
      <div className={divClassName}>
        {original.isNew  && id === 'name' ? newNameInput: input}
      </div>
      {errorMessage && <div className='error text-danger'>{errorMessage}</div>}
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

  let unitSelect;

  if (id === 'amount_unit') {
    unitSelect = (
      <select className={ `${id} serv-input` } style={{width: '85px'}} value={value} onChange={onChange} onBlur={onBlur}>
        {amountUnits.map((unit, i) => {
          return <option key={i} value={unit}>{unit}</option>
        })}
      </select>
    )
  } else {
    let units = id === 'weight_unit' ? weightUnits: volumeUnits;

    unitSelect = (
      <select className={`${id} serv-input`} style={id==='weight_unit' ? {width: '55px'} : {width: '75px'}}
      value={value} onChange={onChange} onBlur={onBlur}>
        <option key='0' value=''>---</option>
        {units.map((unit, i) => {
          return <option key={i + 1} value={unit}>{unit}</option>
        })}
      </select>
    )
  } 

  let divClassName = 'select-wrapper p-1';

  if (isEdited) {
    divClassName += ' bg-primary'
  }

  const selectDiv = (
    <div className='cell-wrapper'>
      <div className={divClassName}>
        {unitSelect}
      </div>
      {errorMessage && <div className='error text-danger'>{errorMessage}</div>}
    </div>
  )

  return selectDiv;
}