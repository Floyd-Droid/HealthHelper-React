import { pool } from '../db.js';
import { convertEmptyStringToNull, makeEntryNameList } from './dbData.js';

export async function getLogEntries(userId, date) {
	const result = {entries: [], errorMessages: [], successMessages: []};

  const q = `
    SELECT logs.id, logs.index_id, logs.amount, logs.amount_unit, logs.timestamp_added,
      food_index.name, food_index.serving_by_weight, food_index.weight_unit,
      food_index.serving_by_volume, food_index.volume_unit, food_index.serving_by_item,
      food_index_macro.calories, food_index_macro.total_fat, food_index_macro.sat_fat,
      food_index_macro.trans_fat, food_index_macro.poly_fat, food_index_macro.mono_fat,
      food_index_macro.cholesterol, food_index_macro.sodium, food_index_macro.total_carbs,
      food_index_macro.total_fiber, food_index_macro.sol_fiber, food_index_macro.insol_fiber,
      food_index_macro.total_sugars, food_index_macro.added_sugars, food_index_macro.protein,
      cost.cost_per_container, cost.servings_per_container
    FROM logs
    LEFT JOIN food_index ON logs.index_id = food_index.id
    LEFT JOIN food_index_macro ON food_index.id = food_index_macro.id
    LEFT JOIN cost ON logs.index_id = cost.id
    WHERE logs.user_id = $1
    AND logs.timestamp_added::date = date ($2)
    ORDER BY logs.id DESC;
  `;

    try {
      const dbResponse = await pool.query(q, [userId, date]);
			result.entries = dbResponse.rows;
      return result;
    } catch (err) {
      console.log(err);
			result.errorMessages.push('Please check your connection and try again.');
      return result;
    }
}

export async function createLogEntries(entries, userId, date) {
  const client = await pool.connect();

	const result = {errorMessages: [], successMessages: []};

  const preparedEntries = convertEmptyStringToNull(entries);
  const failedEntries = [];

  const createLogsQuery = `
    INSERT INTO logs (index_id, user_id, timestamp_added, amount, amount_unit)
    VALUES ($1, $2, date ($3), $4, $5);
  `;

  for (const entry of preparedEntries) {
    try {
      const values = [entry.id, userId, date, entry.amount, entry.amount_unit];
      await client.query(createLogsQuery, values);
    } catch(err) {
      console.log(err);
      failedEntries.push(entry.name);
    }
  }
  client.release();

  if (failedEntries.length) {
		const entryNameList = makeEntryNameList(failedEntries);
		result.errorMessages.push('The following entries were not created: ' + entryNameList);
  }

	if (failedEntries.length !== entries.length) {
		result.successMessages.push('Entries successfully created');
	}
	
  return result;
}

export async function updateLogEntries(entries, userId, date) {
  const client = await pool.connect();

	const result = {errorMessages: [], successMessages: []};

  const preparedEntries = convertEmptyStringToNull(entries);
  const failedEntries = [];

	const updateLogsQuery = `
		UPDATE logs
		SET
			amount = $1,
			amount_unit = $2
		WHERE id = $3
		AND user_id = $4
		AND timestamp_added::date = date ($5);
	`;

  for (const entry of preparedEntries) {
    try {
      const values = [entry.amount, entry.amount_unit, entry.id, userId, date];
      await client.query(updateLogsQuery, values);
    } catch (err) {
      console.log(err);
      failedEntries.push(entry.name);
    } 
  }
  client.release();

  if (failedEntries.length) {
		const entryNameList = makeEntryNameList(failedEntries);
		result.errorMessages.push('The following entries were not updated: ' + entryNameList);
  }

	if (failedEntries.length !== entries.length) {
		result.successMessages.push('Entries successfully updated');
	}

  return result;
}

export async function deleteLogEntries(entries, userId, date) {
  const client = await pool.connect();

	const result = {errorMessages: [], successMessages: []};
  const failedEntries = [];

  const deleteLogsQuery = `
    DELETE FROM logs
    WHERE id = $1
    AND user_id = $2
    AND timestamp_added::date = date ($3);
  `;

  for (const entry of entries) {
    try {
      const values = [entry.id, userId, date];
      await client.query(deleteLogsQuery, values);
    } catch(err) {
      console.log(err);
      failedEntries.push(entry.name);
    }
  }
  client.release();

  if (failedEntries.length) {
		const entryNameList = makeEntryNameList(failedEntries);
		result.errorMessages.push('The following entries were not deleted:' + entryNameList);
  }

	if (failedEntries.length !== entries.length) {
		result.successMessages.push('Entries successfully deleted');
	}

  return result;
}
