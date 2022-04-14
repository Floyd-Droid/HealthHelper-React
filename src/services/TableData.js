// Functions that calculate and organize database entry info for display in a table.

export function round(num, precision) {
  let round = Math.round(num + "e+" + precision) + ("e-" + precision);
  return Number(round);
}


export function organizeLogEntries(entries) {
  let servings;
  let organizedEntries = [];

  // The table is populated with 'NaN'. Creating a deep copy of the entries solves this.
  let entriesCopy = JSON.parse(JSON.stringify(entries))

  for (let entry of entriesCopy) {

    // Calculate the number of servings the entry is. 
    // Divide the amount by its corresponding serving size
    if (entry.amount_unit === entry.weight_unit) {
      servings = entry.amount / entry.serving_by_weight;
    } else if (entry.amount_unit === entry.volume_unit) {
      servings = entry.amount / entry.serving_by_volume;
    } else if (entry.amount_unit === 'item(s)') {
      servings = entry.amount / entry.serving_by_item;
    }

    // Calculate the cost of the entry
    let costPerServing = entry.cost_per_container && entry.servings_per_container
      ? entry.cost_per_container / entry.servings_per_container
      : null;

    // Set the cost to emtpy strig if cost per serving is null
    entry.cost = costPerServing ? round(costPerServing, 2) : '';

    Object.keys(entry).forEach((key) => {

      if (typeof entry[key] === 'number' && key !== 'amount') {
        let result = entry[key] * servings;
        let precision = key === 'cost' ? 2 : 1;
        entry[key] = round(result, precision);
      } else if (entry[key] === null) {
        entry[key] = '';
      }
    })

    entry.amount = entry.amount ? entry.amount + ' ' + entry.amount_unit : '';

    const { amount_unit, serving_by_weight, weight_unit, serving_by_volume,
      volume_unit, serving_by_item, cost_per_container, servings_per_container,
      ...organizedEntry } = entry;

    organizedEntries.push(organizedEntry);
  };
  return organizedEntries;
}

export function organizeIndexEntries(entries) {
  // Organize index entry information to be displayed in the table.
  let organizedEntries = [];

  for (let entry of entries) {

    Object.keys(entry).forEach((key) => {
      entry[key] = entry[key] === null ? '' : entry[key];
    })

    let cost_per_serving = entry.cost_per_container / entry.servings_per_container;
    entry.cost_per_serving = round(cost_per_serving, 2);

    organizedEntries.push(entry);
  };

  return organizedEntries;
}