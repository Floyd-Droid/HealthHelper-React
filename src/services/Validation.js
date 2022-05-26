import {weightUnits, volumeUnits, fourDigitIds, twoDecimalIds} from '../services/TableData';

const validateInputLength = (input, colId) => {
  if (fourDigitIds.includes(colId)) {
    if ((String(parseInt(Number(input), 10)) .length > 4) || input === '00') return false;
  } else {
    if ((String(parseInt(Number(input), 10)).length > 3) || input === '00') return false;
  }

  if (input.includes(".")) {
    if (twoDecimalIds.includes(colId)) {
      if (input.split(".")[1].length > 2) return false;
    } else {
      if (input.split(".")[1].length > 1) return false;
    }
  }

  return true;
}

export const validateInput = (input, colId) => {
  if (colId === 'name') {
    if (input.length > 70) return false;
  } else if (isNaN(Number(input))) {
    return false;
  } else if (Number(input) < 0) {
    return false;
  } else {
    return validateInputLength(input, colId);
  }

  return true;
}

export const validateSelect = (value, colId, amountUnits) => {
  if (colId === 'amount_unit') {
    if (!amountUnits.includes(value)) return false;
  } else {
    let tmpUnits = colId === 'weight_unit' ? [...weightUnits] : [...volumeUnits];
    tmpUnits.push('')
    if (!tmpUnits.includes(value)) return false;
  }

  return true;
}

export const validateRequiredServingSize = (entries) => {
  for (let entry of entries) {
    const servWeight = entry.serving_by_weight;
    const weightUnit = entry.weight_unit;
    const servVolume = entry.serving_by_volume;
    const volumeUnit = entry.volume_unit;
    const servItem = entry.serving_by_item;

    if (!((servWeight && weightUnit) || (servVolume && volumeUnit) || servItem )) {
      alert(
        `Please fill in at least one of the serving size field sets for each entry:\n
        \u2022 Weight quantity and weight unit
        \u2022 Volume quantity and volume unit
        \u2022 Item quantity
        `);
      return false;
    }
    return true;
  }
}

export const validateRequiredLogUnit = (entries) => {
  for (let entry of entries) {
    if (entry.amount_unit === '---') {
      alert(
        `Please give a unit for each entry. The following has none:\n
        \u2022 ${entry.name}
      `)
      return false;
    }
  }
  return true;
}

export const validateUniqueNames = (entries) => {
  let names = [];
  for (let entry of entries) {
    if (names.includes(entry.name)) {
      alert(
        `Please give unique names for each entry. The following is a duplicate:\n
        \u2022 ${entry.name}
      `)
      return false;
    }
    names.push(entry.name)
  }

  return true;
}