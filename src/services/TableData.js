// Functions that calculate and organize database entry info for display in a table.

export function round(num, precision) {
  let round = Math.round(num + "e+" + precision) + ("e-" + precision);
  return Number(round);
}


export function prepareForLogTable(entries) {
  // Make a deep copy of the entries. [why do i need this? maybe i don't!]
  //let entriesCopy = JSON.parse(JSON.stringify(entries))

  let servings;
  let preparedEntries = [];
  
  for (let entry of entries) {

    // Calculate the number of servings. 
    // Divide the amount by its corresponding serving size (match the units)
    if (entry.amount_unit === entry.weight_unit) {
      servings = entry.amount / entry.serving_by_weight;
    } else if (entry.amount_unit === entry.volume_unit) {
      servings = entry.amount / entry.serving_by_volume;
    } else if (entry.amount_unit === 'item(s)') {
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

    let cost_per_serving = entry.cost_per_container / entry.servings_per_container;
    entry.cost_per_serving = round(cost_per_serving, 2);

    preparedEntries.push(entry);
  };

  return preparedEntries;
}