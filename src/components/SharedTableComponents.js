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

export const CalculatedCell = ({
  row: { index, original },
  column: { id },
  indexEntries,
  status,
  updateTableData
}) => {

  let indexValue, indexEntry, servings;
  for (let entry of indexEntries) {
    if (entry.id === original.id) {
      indexValue = entry[id];
      indexEntry = entry;
      break;
    }
  }

  let amount = original.amount;
  let unit = original.amount_unit;
  let result = '';

  const [indexCellValue, setIndexCellValue] = React.useState(indexValue);
  const [value, setValue] = React.useState();

  React.useEffect(() => {
    if (amount && indexEntry) {
      if (unit === 'servings') {
        servings = amount;
      } else if (unit === indexEntry.weight_unit) {
        servings = amount / indexEntry.serving_by_weight;
      } else if (unit === indexEntry.volume_unit) { 
        servings = amount / indexEntry.serving_by_volume;
      } else if (unit === 'items') {
        servings = amount / indexEntry.serving_by_item;
      }

      let precision = id === 'cost_per_serving' ? 2 : 1;
      result = round(Number(servings) * Number(indexValue), precision);
    }

    setValue(result)
    updateTableData(index, id, result)
  }, [amount, unit, indexEntries])

  return (
    <div>
      {value}
    </div>
  );
}

export const Input = ({
  value: initialCellValue,
  row: { index, original },
  column: { id },
  indexEntries,
  status,
  logEntries,
  updateEditedEntryIds,
  updateTableData,
}) => {

  let init = '';
  let entries = [];

  const [initialEntryValue, setInitialEntryValue] = React.useState(init);


  React.useEffect(() => {
    if (status === 'index' && indexEntries.length) {
      entries = indexEntries;
    } else if (status === 'logs' && logEntries.length) {
      entries = logEntries;
    }

    if (status !== 'addLog') {
      for (let entry of entries) {
        if (entry.id === original.id) {
          init = entry[id];
          break;
        }
      }
    }

    setInitialEntryValue(init)
    setIsEdited(false)
  }, [logEntries, indexEntries])

  const [value, setValue] = React.useState(init);
  const [isEdited, setIsEdited] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const onChange = e => {
    let newValue = e.target.value;
    setValue(newValue);

    if ((String(newValue) !== String(initialEntryValue)) && !isEdited) {
      if (status !== 'addLog') {
        updateEditedEntryIds(original.id, 'add');
      }
      setIsEdited(true);
    } else if ((String(newValue) === String(initialEntryValue)) && isEdited) {
      if (status !== 'addLog') {
        updateEditedEntryIds(original.id, 'remove');
      }
      setIsEdited(false);
    }

    const validationMessage = validateInput(id, newValue);
    if (validationMessage) {
      setErrorMessage(validationMessage);
    } else {
      setErrorMessage('');
    }

    updateTableData(index, id, newValue);
  }

  React.useEffect(() => {
    setValue(initialCellValue);

    if (String(initialCellValue) === String(initialEntryValue)) {
      setIsEdited(false)
      setErrorMessage('')
    }
  }, [initialCellValue]);

  let inputClassName = id === 'name' ? `${id} text-left` : `${id} text-center`;
  inputClassName += 'p-0 m-0 border-0';


  let divClassName = '';

  if (isEdited) {
    if (errorMessage) {
      divClassName += ' bg-cell-error';
    } else {
      divClassName += ' bg-cell-edit';
    }
  }

  const input = (
    <input className={inputClassName} 
      style={id==='name' ? {} : {width: '40px'}}
      value={value} onChange={onChange} />
  )

  return (
    <div className={divClassName}>
      {input}
    </div>
  )
}

export const Select = ({
  value: initialCellValue,
  row: { index, original },
  column: { id },
  indexEntries,
  status,
  logEntries,
  updateEditedEntryIds,
  updateTableData,
}) => {

  let init = 'servings';
  let entries = [];

  React.useEffect(() => {
    if (status === 'index' && indexEntries.length) {
      entries = indexEntries;
    } else if (status === 'logs' && logEntries.length) {
      entries = logEntries;
    }

    if (status !== 'addLog') {
      for (let entry of entries) {
        if (entry.id === original.id) {
          init = entry[id];
          break;
        }
      }
    }
    setInitialEntryValue(init)
    setIsEdited(false)
  }, [logEntries, indexEntries])

  const [initialEntryValue, setInitialEntryValue] = React.useState(init)
  const [value, setValue] = React.useState(init);
  const [isEdited, setIsEdited] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const amountUnits = [
    'servings',
    ...(original.weight_unit ? [original.weight_unit] : []),
    ...(original.volume_unit ? [original.volume_unit] : []),
    ...(original.serving_by_item ? ['items'] : []),
  ]

  React.useEffect(() => {
    setValue(initialCellValue)

    if (String(initialCellValue) === String(initialEntryValue)) {
      setIsEdited(false)
      setErrorMessage('')
    }
  }, [initialCellValue])

  let units = (id === 'amount_unit')
  ? amountUnits 
  : id === 'weight_unit' 
    ? weightUnits
    : volumeUnits;

  const onChange = e => {
    let newVal = e.target.value
    setValue(newVal);

    if ((String(newVal) !== String(initialEntryValue)) && !isEdited) {
      if (status === 'logs') {
        updateEditedEntryIds(original.id, 'add');
      }
      setIsEdited(true);
    } else if ((String(newVal) === String(initialEntryValue)) && isEdited) {
      if (status === 'logs') {
        updateEditedEntryIds(original.id, 'remove');
      }
      setIsEdited(false);
    }

    const validationMessage = validateSelect(id, newVal, amountUnits);
    if (validationMessage) {
      setErrorMessage(validationMessage);
    } else {
      setErrorMessage('');
    }

    updateTableData(index, id, newVal);
  }

  let divClassName = 'p-2 m-0';

  if (isEdited) {
    if (errorMessage) {
      divClassName += ' bg-cell-error';
    } else {
      divClassName += ' bg-cell-edit';
    }
  }

  let unitSelect = (
    <div className={divClassName}>
      <select className={ `${id}` } value={value} onChange={onChange}
        style={(id === 'amount_unit' ? {width: '95px'} : {...(id==='weight_unit' ? {width: '55px'} : {width: '75px'})})}>
        {id!=='amount_unit' ? <option key='0' value=''>---</option> : null}
        {units.map((unit, i) => {
          return <option key={i} value={unit}>{unit}</option>
        })}
      </select>
    </div>

  )

  return unitSelect;
}
