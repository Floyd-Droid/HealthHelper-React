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
  } else if (isNaN(Number(value))){
    message = 'Must be a number';
  } else if (Number(value) < 0) {
    message = 'Number must be positive'
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

// export const CalculatedCell = ({
//   row: { index, original },
//   column: { id },
//   indexEntries,
//   logEntries,
//   updateTableData
// }) => {

//   let servings = 0;

//   const [indexCellValue, setIndexCellValue] = React.useState();
//   const [indexEntry, setIndexEntry] = React.useState();
//   const [value, setValue] = React.useState();

//   React.useEffect(() => {
//     for (let entry of indexEntries) {
//       if (entry.id === original.id) {
//         setIndexCellValue(entry[id]);
//         setIndexEntry(entry);
//         break;
//       }
//     }
//   }, [indexEntries, logEntries])

//   let amount = original.amount;
//   let unit = original.amount_unit;
//   let result = '';

//   React.useEffect(() => {
//     if (['', undefined].includes(indexCellValue) || Number(amount) < 0) {
//       result = '';
//     } else if (amount && !isNaN(Number(amount)) && indexEntry) {
//       if (unit === 'servings') {
//         servings = amount;
//       } else if (unit === indexEntry.weight_unit) {
//         servings = amount / indexEntry.serving_by_weight;
//       } else if (unit === indexEntry.volume_unit) { 
//         servings = amount / indexEntry.serving_by_volume;
//       } else if (unit === 'items') {
//         servings = amount / indexEntry.serving_by_item;
//       }

//       let precision = id === 'cost_per_serving' ? 2 : 1;
//       result = round(Number(servings) * Number(indexCellValue), precision);
//     }

//     setValue(result)
//     updateTableData(index, id, result)
//   }, [amount, unit, indexEntry, indexCellValue])

//   return (
//     <div>
//       {value}
//     </div>
//   );
// }

const getOriginalEntry = (status, indexEntries, logEntries, originalId) => {
  let result = '';
    
  if (status !== 'addLog') {
    let entries = [];
    if (status === 'index' && indexEntries.length) {
      entries = indexEntries;
    } else if (status === 'logs' && logEntries.length) {
      entries = logEntries;
    }

    for (let entry of entries) {
      if (entry.id === originalId) {
        result = entry;
        break;
      }
    }
  }

  return result;
}

export const CalculatedCell = ({
  column: { colId },
  row: { original },
  indexEntries,
  logEntries
}) => {
  let amount = original.amount;
  let unit = original.amount_unit;

  const indexEntry = React.useMemo(() => {
    let result = {};
    if (indexEntries.length) {
      for (let entry of indexEntries) {
        if (entry.id === original.id) {
          result = entry;
        }
      }
    }
    return result;
  }, [indexEntries, logEntries])

  let originalIndexValue = indexEntry[colId];

  const value = React.useMemo(() => {
    let result = '';
    let servings = 0;

    if (['', undefined].includes(originalIndexValue) || Number(amount) < 0) {
      result = '';
    } else if (amount && !isNaN(Number(amount)) && indexEntry) {
      if (unit === 'servings') {
        servings = amount;
      } else if (unit === indexEntry.weight_unit) {
        servings = amount / indexEntry.serving_by_weight;
      } else if (unit === indexEntry.volume_unit) { 
        servings = amount / indexEntry.serving_by_volume;
      } else if (unit === 'items') {
        servings = amount / indexEntry.serving_by_item;
      }

      let precision = colId === 'cost_per_serving' ? 2 : 1;
      result = round(Number(servings) * Number(originalIndexValue), precision);
    }

    return result;
  }, [amount, unit, indexEntry, originalIndexValue])

  return (
    <div>
      {value}
    </div>
  );
}

export const Input = ({
  value: initialCellValue,
  column: { colId },
  row: { index, original },
  indexEntries,
  status,
  logEntries,
  updateEditedEntryIds,
  updateTableData,
}) => {

  const [value, setValue] = React.useState(initialCellValue);
  const [isEdited, setIsEdited] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  // const initialEntryValue = React.useMemo(() => {
  //   let result = '';
    
  //   if (status !== 'addLog') {
  //     let entries = [];
  //     if (status === 'index' && indexEntries.length) {
  //       entries = indexEntries;
  //     } else if (status === 'logs' && logEntries.length) {
  //       entries = logEntries;
  //     }

  //     for (let entry of entries) {
  //       if (entry.id === original.id) {
  //         result = entry[id];
  //         break;
  //       }
  //     }
  //   }

  //   return result;
  // }, [logEntries, indexEntries])

  const originalEntry = React.useMemo(
    () => 
      getOriginalEntry(status, indexEntries, logEntries, original.id), 
      [logEntries, indexEntries]
  )

  let originalEntryValue = originalEntry[colId];

  React.useEffect(() => {
    setValue(initialCellValue);

    if (String(initialCellValue) === String(originalEntryValue)) {
      setIsEdited(false)
      setErrorMessage('')
    }
  }, [initialCellValue, indexEntries, logEntries]);

  const onChange = e => {
    let newValue = e.target.value;
    setValue(newValue);

    if (status !== 'addLog') {
      if ((String(newValue) !== String(originalEntryValue)) && !isEdited) {
        updateEditedEntryIds(original.id, 'add');
        setIsEdited(true);
      } else if ((String(newValue) === String(originalEntryValue)) && isEdited) {
        updateEditedEntryIds(original.id, 'remove');
        setIsEdited(false);
      }
    }

    const validationMessage = validateInput(colId, newValue);
    if (validationMessage) {
      setErrorMessage(validationMessage);
    } else {
      setErrorMessage('');
    }

    updateTableData(index, colId, newValue);
  }

  let inputClassName = colId === 'name' ? `${colId} text-left` : `${colId} text-center`;
  inputClassName += ' p-0 m-0 border-0';


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
      style={colId==='name' ? {} : {width: '40px'}}
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
  column: { colId },
  indexEntries,
  status,
  logEntries,
  updateEditedEntryIds,
  updateTableData,
}) => {

  const [value, setValue] = React.useState(initialCellValue);
  const [isEdited, setIsEdited] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const originalEntry = React.useMemo(
    () => 
      getOriginalEntry(status, indexEntries, logEntries, original.id), 
      [logEntries, indexEntries]
    )
  
  let originalEntryValue = originalEntry ? originalEntry[colId] : '';
  console.log('originla: ', originalEntry)

  const amountUnits = [
    'servings',
    ...(original.weight_unit ? [original.weight_unit] : []),
    ...(original.volume_unit ? [original.volume_unit] : []),
    ...(original.serving_by_item ? ['items'] : []),
  ]

  React.useEffect(() => {
    setValue(initialCellValue)

    if (String(initialCellValue) === String(originalEntryValue)) {
      setIsEdited(false)
      setErrorMessage('')
    }
  }, [initialCellValue, indexEntries, logEntries])

  let units = (colId === 'amount_unit')
  ? amountUnits 
  : colId === 'weight_unit' 
    ? weightUnits
    : volumeUnits;

  const onChange = e => {
    let newVal = e.target.value
    setValue(newVal);

    if (status !== 'addLog') {
      if ((String(newVal) !== String(originalEntryValue)) && !isEdited) {
        updateEditedEntryIds(original.id, 'add');
        setIsEdited(true);
      } else if ((String(newVal) === String(originalEntryValue)) && isEdited) {
        updateEditedEntryIds(original.id, 'remove');
        setIsEdited(false);
      }
    }

    const validationMessage = validateSelect(colId, newVal, amountUnits);
    if (validationMessage) {
      setErrorMessage(validationMessage);
    } else {
      setErrorMessage('');
    }

    updateTableData(index, colId, newVal);
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
      <select className={ `${colId}` } value={value} onChange={onChange}
        style={(colId === 'amount_unit' ? {width: '95px'} : {...(colId==='weight_unit' ? {width: '55px'} : {width: '75px'})})}>
        {colId!=='amount_unit' ? <option key='0' value=''>---</option> : null}
        {units.map((unit, i) => {
          return <option key={i} value={unit}>{unit}</option>
        })}
      </select>
    </div>
  )

  return unitSelect;
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
    <div>
      {value}
    </div>
  )
}

export const SumFooter = ({
  rows,
  selectedFlatRows,
  status,
  column: { colId }
}) => {

  const total = React.useMemo(
    () =>
      rows.reduce((sum, row) => Number(row.values[colId]) + sum, 0),
      [rows]
  )
  const selectedTotal = React.useMemo(
    () => 
      selectedFlatRows.reduce((sum, row) => Number(row.values[colId]) + sum, 0),
      [selectedFlatRows]
  )

  let selectedTotalDivClassName = 'text-center py-2';
  let totalDivClassName = 'text-center py-2';

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