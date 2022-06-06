// Functions and variables to display entries in a table

export const weightUnits = ['g', 'mg', 'kg', 'lbs', 'oz'];
export const volumeUnits = ['tbsp', 'tsp', 'cups', 'gal', 'pt', 'qt', 'L', 'mL'];
export const fourDigitIds = ['calories', 'cholesterol', 'sodium'];
export const twoDecimalIds = ['amount', 'serving_by_weight', 'serving_by_volume', 'cost_per_container', 'cost_per_serving'];

export const newIndexRow = {
	name: '',
	serving_by_weight: '',
	weight_unit: '',
	serving_by_volume: '',
	volume_unit: '',
	serving_by_item: '',
	calories: '',
	total_fat: '',
	sat_fat: '',
	trans_fat: '',
	poly_fat: '',
	mono_fat: '',
	cholesterol: '',
	sodium: '',
	total_carbs: '',
	total_fiber: '',
	sol_fiber: '',
	insol_fiber: '',
	total_sugars: '',
	added_sugars: '',
	protein: '',
	cost_per_container: '',
	servings_per_container: '',
	cost_per_serving: '',
};

export const placeholderLogRow = {
	isPlaceholder: true,
	name: '',
	amount: '',
	amount_unit: '---',
	calories: '',
	total_fat: '',
	sat_fat: '',
	trans_fat: '',
	poly_fat: '',
	mono_fat: '',
	cholesterol: '',
	sodium: '',
	total_carbs: '',
	total_fiber: '',
	sol_fiber: '',
	insol_fiber: '',
	total_sugars: '',
	added_sugars: '',
	protein: '',
	cost_per_serving: '',
};



export function round(num, precision) {
  let round = Math.round(num + "e+" + precision) + ("e-" + precision);
  let result = precision === 2 ? Number(round).toFixed(2) : Number(round);
  return result;
}

export const prepareEntries = (entries, status) => {
  let preparedEntries = [];

  for (let entry of entries) {
    Object.keys(entry).forEach((key) => {
      if (key !== 'id') {
        entry[key] = entry[key] === null ? '' : entry[key];
      }
    })

    entry.cost_per_container = entry.cost_per_container !== ''
      ? round(entry.cost_per_container, 2)
      : entry.cost_per_container;

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

export const getFormattedDate = (date, context) => {
  if (context === 'table') {
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  } else if (context === 'url') {
    let slashDate = date.toLocaleDateString('en-CA', { year: 'numeric', month: 'numeric', day: 'numeric' });
    return slashDate.replace(/\//g, '-');
  }
}