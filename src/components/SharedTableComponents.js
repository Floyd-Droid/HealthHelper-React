import React from 'react';

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

export const EditableInputCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateTableData
}) => {
  const [value, setValue] = React.useState(initialValue);

  const onChange = e => {
      setValue(e.target.value);
  }

  const onBlur = () => {
      updateTableData(index, id, value);
  }

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  let inputClassName = id === 'name' ? 'cell-input name-input text-left' : 'cell-input num-input text-center';

  return (
    <div className='cell-input-wrapper'>
      <input className={inputClassName} value={value} onChange={onChange} onBlur={onBlur} />
    </div>
  )
}

export const EditableSelectCell = ({
  value: initialValue,
  row: { index, original },
  column: { id },
  updateTableData,
}) => {
  const [value, setValue] = React.useState(initialValue);

  const onChange = e => {
    setValue(e.target.value);
  }

  const onBlur = () => {
    updateTableData(index, id, value);
  }

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const weightUnits = ['g', 'mg', 'kg', 'lbs', 'oz']
  const volumeUnits = ['tbsp', 'tsp', 'cup(s)', 'gal', 'pt', 'qt', 'L', 'mL']

  // conditionally add log amount units (only if they exist).
  // Below works since the spread operator does nothing if the operand is an empty array
  const amountUnits = [
    ...(original.weight_unit ? [original.weight_unit] : []),
    ...(original.volume_unit ? [original.volume_unit] : []),
    ...(original.serving_by_item ? ['item(s)'] : []),
  ]

  const amountSelect = (
    <select className='amount-select' defaultValue={value} onChange={onChange} onBlur={onBlur}>
      <option key='0' value='' disabled hidden>---</option>
      {amountUnits.map((unit, i) => {
        return <option key={i + 1} value={unit}>{unit}</option>
      })}
    </select>
  )

  const weightSelect = (
    <select className='weight-select' defaultValue={value} onChange={onChange} onBlur={onBlur}>
      <option key='0' value='' disabled hidden>---</option>
      {weightUnits.map((unit, i) => {
        return <option key={i + 1} value={unit}>{unit}</option>
      })}
    </select>
  )

  const volumeSelect = (
    <select className='volume-select' defaultValue={value} onChange={onChange} onBlur={onBlur}>
      <option key="0" value='' disabled hidden>---</option>
      {volumeUnits.map((unit, i) => {
        return <option key={i + 1}>{unit}</option>
      })}
    </select>
  )

  const selectDiv = (
    <div className='cell-wrapper'>
      <div className='select-wrapper'>
        {id === 'amount_unit' && amountSelect}
        {id === 'weight_unit' && weightSelect}
        {id === 'volume_unit' && volumeSelect}
      </div>
    </div>
  )

  return selectDiv;
}