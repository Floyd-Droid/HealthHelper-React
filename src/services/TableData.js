// Functions and variables to display entries in a table

export const weightUnits = ['g', 'mg', 'kg', 'lbs', 'oz'];
export const volumeUnits = ['tbsp', 'tsp', 'cups', 'gal', 'pt', 'qt', 'L', 'mL'];

export function round(num, precision) {
  let round = Math.round(num + "e+" + precision) + ("e-" + precision);
  return Number(round);
}

export function prepareEntries(entries, status) {
  let preparedEntries = [];

  for (let entry of entries) {
    Object.keys(entry).forEach((key) => {
      if (key !== 'id') {
        entry[key] = entry[key] === null ? '' : entry[key];
      }
    })

    let costPerServing = entry.cost_per_container && entry.servings_per_container
    ? entry.cost_per_container / entry.servings_per_container
    : '';

    entry.cost_per_serving = costPerServing;

    if (status === 'createLog') {
      entry.amount = '';
      entry.amount_unit = 'servings';
    }

    preparedEntries.push(entry);
  }

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