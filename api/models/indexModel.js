const { pool } = require("../db.js");
const { convertEmptyStringToNull, makeEntryNameList } = require("./dbData.js");

async function getIndexEntries(userId) {
  const getEntriesQuery = `
    SELECT food_index.id, food_index.name, food_index.serving_by_weight, food_index.weight_unit, 
      food_index.serving_by_volume, food_index.volume_unit, food_index.serving_by_item,
      food_index_macro.calories, food_index_macro.total_fat, food_index_macro.sat_fat,
      food_index_macro.trans_fat, food_index_macro.poly_fat, food_index_macro.mono_fat,
      food_index_macro.cholesterol, food_index_macro.sodium, food_index_macro.total_carbs,
      food_index_macro.total_fiber, food_index_macro.sol_fiber, food_index_macro.insol_fiber,
      food_index_macro.total_sugars, food_index_macro.added_sugars, food_index_macro.protein,
      cost.cost_per_container, cost.servings_per_container
    FROM food_index
    LEFT JOIN food_index_macro ON food_index.id = food_index_macro.id
    LEFT JOIN cost ON food_index.id = cost.id
    WHERE food_index.user_id = $1
    ORDER BY food_index.name ASC;
  `;

  try {
    const values = [userId];
    const dbResponse = await pool.query(getEntriesQuery, values);
    return {entries: dbResponse.rows};
  } catch (err) {
    console.log(err)
    return {errorMessage: 'Please check your connection and try again.'}
  }
}

async function createIndexEntries(entries, userId) {
  const client = await pool.connect();

  const preparedEntries = convertEmptyStringToNull(entries);
  const failedEntries = [];

	const createEntryQuery = `
		WITH index_insert AS (
			INSERT INTO food_index 
				(user_id, name, serving_by_weight, weight_unit, serving_by_volume, volume_unit, serving_by_item) VALUES
				($1, $2, $3, $4, $5, $6, $7) RETURNING id AS new_entry_id
			),
		index_macro_insert AS (
			INSERT INTO food_index_macro
				(id, calories, total_fat, sat_fat, trans_fat, poly_fat, mono_fat, cholesterol, sodium, total_carbs, 
					total_fiber, sol_fiber, insol_fiber, total_sugars, added_sugars, protein) VALUES
				(
					(SELECT new_entry_id FROM index_insert), 
					$8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
				)
			)
		INSERT INTO cost
			(id, cost_per_container, servings_per_container) 
			SELECT new_entry_id, $23, $24 FROM index_insert;
	`;

  for (const entry of preparedEntries) {
    try {
      const values = [userId, entry.name, entry.serving_by_weight,
        entry.weight_unit, entry.serving_by_volume, entry.volume_unit,
        entry.serving_by_item, entry.calories, entry.total_fat, entry.sat_fat,
        entry.trans_fat, entry.poly_fat, entry.mono_fat, entry.cholesterol,
        entry.sodium, entry.total_carbs, entry.total_fiber, entry.sol_fiber,
        entry.insol_fiber,entry.total_sugars, entry.added_sugars,
        entry.protein, entry.cost_per_container, entry.servings_per_container];
      
      await client.query(createEntryQuery, values);
    } catch (err) {
      console.log(err);
      failedEntries.push(entry.name)
    }
  }
  client.release();

  if (failedEntries.length) {
		const entryNameList = makeEntryNameList(failedEntries);
    return {errorMessage: 'The following entries were not created: ' + entryNameList}
  }
  return {successMessage: 'Entries successfully created'};
}

async function updateIndexEntries(entries, userId) {
  const client = await pool.connect();

  const preparedEntries = convertEmptyStringToNull(entries);
  const failedEntries = [];

	const foodIndexQuery = `
		UPDATE food_index
		SET
			name = $1,
			serving_by_weight = $2,
			weight_unit = $3,
			serving_by_volume = $4,
			volume_unit = $5,
			serving_by_item = $6
		WHERE food_index.id = $7
		AND user_id = $8; 
	`;

	const foodIndexMacroQuery = `
		UPDATE food_index_macro
		SET
			calories = $1,
			total_fat = $2,
			sat_fat = $3,
			trans_fat = $4,
			poly_fat = $5,
			mono_fat = $6,
			cholesterol = $7,
			sodium = $8,
			total_carbs = $9,
			total_fiber = $10,
			sol_fiber = $11,
			insol_fiber = $12,
			total_sugars = $13,
			added_sugars = $14,
			protein = $15
		WHERE food_index_macro.id = $16;
	`;

	const costQuery = `
		UPDATE cost
		SET
			cost_per_container = $1,
			servings_per_container = $2
		WHERE cost.id = $3;
	`;
  
  for (const entry of preparedEntries) {
    try {
      await client.query('BEGIN');

      const foodIndexValues = [entry.name, entry.serving_by_weight, entry.weight_unit, entry.serving_by_volume,
      	entry.volume_unit, entry.serving_by_item, entry.id, userId];

      const res = await client.query(foodIndexQuery, foodIndexValues);

      const foodIndexMacroValues = [entry.calories, entry.total_fat, entry.sat_fat,
				entry.trans_fat, entry.poly_fat, entry.mono_fat,
				entry.cholesterol, entry.sodium, entry.total_carbs,
				entry.total_fiber, entry.sol_fiber, entry.insol_fiber,
				entry.total_sugars, entry.added_sugars, entry.protein, entry.id];

      await client.query(foodIndexMacroQuery, foodIndexMacroValues);

      const costValues = [entry.cost_per_container, entry.servings_per_container, entry.id];

      await client.query(costQuery, costValues);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      failedEntries.push(entry.name)
      console.log(err)
    } 
  }
  client.release();
  
  if (failedEntries.length) {
		const entryNameList = makeEntryNameList(failedEntries);
    return {errorMessage: 'The following entries were not updated: ' + entryNameList}
  }
  return {successMessage: 'Entries successfully updated'};
}

async function deleteIndexEntries(entries, userId) {
  const client = await pool.connect();
  const failedEntries = [];

  const deleteQuery = `
    DELETE FROM food_index
    WHERE id = $1
    AND user_id = $2;
  `;

  for (const entry of entries) {
    try {
      const values = [entry.id, userId]
      const dbResult = await client.query(deleteQuery, values);
    } catch(err) {
      console.log(err);
      failedEntries.push(entry.name)
    }
  }
  client.release();

  if (failedEntries.length) {
		const entryNameList = makeEntryNameList(failedEntries);
    return {errorMessage: 'The following entries were not deleted: ' + entryNameList}
  }
  return {successMessage: 'Entries successfully deleted'};
}

module.exports = {
  createIndexEntries,
  deleteIndexEntries,
  getIndexEntries,
  updateIndexEntries,
}