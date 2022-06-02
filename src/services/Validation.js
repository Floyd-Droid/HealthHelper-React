import {weightUnits, volumeUnits, fourDigitIds, twoDecimalIds} from '../services/TableData';

// Validation functions for pre-submission

const validateInputLength = (input, colId) => {
  let disallowedInput = ['00', ' '];
  
  if (fourDigitIds.includes(colId)) {
    if ((String(parseInt(Number(input), 10)) .length > 4) || disallowedInput.includes(input)) return false;
  } else {
    if ((String(parseInt(Number(input), 10)).length > 3) || disallowedInput.includes(input)) return false;
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


// Validation functions for post-submission

export const validateRequiredName = (entries) => {
  for (let entry of entries) {
    if (entry.name === '') {
      return 'A name';
    }
  }
  return '';
}

export const validateUniqueNames = (entries) => {
  let names = [];
  for (let entry of entries) {
    if (names.includes(entry.name)) {
      return 'A unique name';
    }
    names.push(entry.name)
  }

  return '';
}

export const validateRequiredServingSize = (entries) => {
  for (let entry of entries) {
    const servWeight = entry.serving_by_weight;
    const weightUnit = entry.weight_unit;
    const servVolume = entry.serving_by_volume;
    const volumeUnit = entry.volume_unit;
    const servItem = entry.serving_by_item;

    if (!((servWeight && weightUnit) || (servVolume && volumeUnit) || servItem )) {
      return 'At least one serving size section filled';
    }
  }
  return '';
}

export const validateRequiredAmountUnit = (entries) => {
  for (let entry of entries) {
    if (entry.amount_unit === '---') {
      return 'An amount unit';
    }
  }
  return '';
}

export const validateLogSubmission = (entries) => {
  const requiredAmountUnitMessage = validateRequiredAmountUnit(entries)

  const messages = [
    ...(requiredAmountUnitMessage ? [requiredAmountUnitMessage] : [])
  ]

  return messages;
}

export const validateIndexSubmission = (entries) => {
  const requiredNameMessage = validateRequiredName(entries);
  const uniqueNameMessage = validateUniqueNames(entries);
  const requiredServingSizeMessage = validateRequiredServingSize(entries)

  const messages = [
    ...( requiredNameMessage ? [requiredNameMessage] : []),
    ...( uniqueNameMessage ? [uniqueNameMessage] : []),
    ...( requiredServingSizeMessage ? [requiredServingSizeMessage] : []),
  ]

  return messages;
}