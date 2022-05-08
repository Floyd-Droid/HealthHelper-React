// Functions and variables to display entries in a table

export const weightUnits = ['g', 'mg', 'kg', 'lbs', 'oz'];
export const volumeUnits = ['tbsp', 'tsp', 'cups', 'gal', 'pt', 'qt', 'L', 'mL'];

export function round(num, precision) {
  let round = Math.round(num + "e+" + precision) + ("e-" + precision);
  return Number(round);
}


export function prepareForLogTable(entries) {

  let servings;
  let preparedEntries = [];
  
  for (let entry of entries) {

    if (entry.amount_unit === 'servings') {
      servings = entry.amount;
    } else if (entry.amount_unit === entry.weight_unit) {
      servings = entry.amount / entry.serving_by_weight;
    } else if (entry.amount_unit === entry.volume_unit) {
      servings = entry.amount / entry.serving_by_volume;
    } else if (entry.amount_unit === 'items') {
      servings = entry.amount / entry.serving_by_item;
    }

    // Calculate the cost of the entry
    // Set the cost per serving to be null if we have incomplete info
    let costPerServing = entry.cost_per_container && entry.servings_per_container
      ? entry.cost_per_container / entry.servings_per_container
      : null;

    entry.cost = costPerServing ? round(costPerServing, 2) : '';

    Object.keys(entry).forEach((key) => {

      if (typeof entry[key] === 'number' && key !== 'amount' && key !== 'id') {
        let result = entry[key] * servings;
        let precision = key === 'cost' ? 2 : 1;
        entry[key] = round(result, precision);
      } else if (entry[key] === null) {
        entry[key] = '';
      }
    })

    preparedEntries.push(entry);
  };

  return preparedEntries;
}

export function prepareForIndexTable(entries) {
  let preparedEntries = [];

  for (let entry of entries) {
    Object.keys(entry).forEach((key) => {
      if (key !== 'id') {
        entry[key] = entry[key] === null ? '' : entry[key];
      }
    })

    let costPerServing = entry.cost_per_container && entry.servings_per_container
    ? entry.cost_per_container / entry.servings_per_container
    : null;

    entry.cost_per_serving = round(costPerServing, 2);

    preparedEntries.push(entry);
  };

  return preparedEntries;
}

export function prepareForAddLogTable(entries) {
  // necessary? Could add flag for the others, conditionally modify
  let preparedEntries = [];

  for (let entry of entries) {
    Object.keys(entry).forEach((key) => {
      if (key !== 'id') {
        entry[key] = entry[key] === null ? '' : entry[key];
      }
    })

    entry.amount = '';
    entry.amount_unit = 'servings';

    let costPerServing = entry.cost_per_container && entry.servings_per_container
    ? entry.cost_per_container / entry.servings_per_container
    : '';

    entry.cost_per_serving = round(costPerServing, 2);

    preparedEntries.push(entry);
  };

  return preparedEntries;
}

export function getFormattedDate(date, context) {
  if (context === 'table') {
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  } else if (context === 'url') {
    let slash_date = date.toLocaleDateString('en-CA', { year: 'numeric', month: 'numeric', day: 'numeric' });
    return slash_date.replace(/\//g, '-');
  } else {
    console.log("see getFormattedDate")
  }
}