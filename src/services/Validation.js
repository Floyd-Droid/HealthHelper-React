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