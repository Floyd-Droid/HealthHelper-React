const { pool } = require("../db.js");
const { prepareForUpdate } = require("../../src/services/EntryService.js");

async function getLogEntries(userId, date) {

  const q = `
    SELECT logs.id, logs.amount, logs.amount_unit,
      food_index.name, food_index.serving_by_weight, food_index.weight_unit,
      food_index.serving_by_volume, food_index.volume_unit, food_index.serving_by_item,
      food_index_macro.calories, food_index_macro.total_fat, food_index_macro.sat_fat,
      food_index_macro.trans_fat, food_index_macro.poly_fat, food_index_macro.mono_fat,
      food_index_macro.cholesterol, food_index_macro.sodium, food_index_macro.total_carbs,
      food_index_macro.total_fiber, food_index_macro.sol_fiber, food_index_macro.insol_fiber,
      food_index_macro.total_sugars, food_index_macro.added_sugars, food_index_macro.protein,
      cost.cost_per_container, cost.servings_per_container
    FROM logs
    LEFT JOIN food_index ON logs.id = food_index.id
    LEFT JOIN food_index_macro ON food_index.id = food_index_macro.id
    LEFT JOIN cost ON logs.id = cost.id
    WHERE logs.user_id = $1
    AND logs.timestamp_added::date = date ($2)
    ORDER BY logs.timestamp_added ASC;
  `;

    try {
      const dbResponse = await pool.query(q, [Number(userId), date]);
      return {entries: dbResponse.rows};
    } catch (err) {
      console.log('error in getLogEntries: ', err)
      return {error: 'Database error'}
    }
}

async function updateLogEntries(entries, userId, date) {
  const client = await pool.connect();

  const preparedEntries = prepareForUpdate(entries);

  for (let entry of preparedEntries) {
    try {
      await client.query('BEGIN');

      const updateLogsQuery = `
        UPDATE logs
        SET
          amount = $1,
          amount_unit = $2
        WHERE id = $3
        AND user_id = $4
        AND timestamp_added::date = date ($5); 
      `;

      let values = [entry.amount, entry.amount_unit, entry.id, Number(userId), date];

      await client.query(updateLogsQuery, values);
    } catch (err) {
      await client.query('ROLLBACK');
      console.log(err)
    } 
  }
  client.release();

  return {message: 'Entries successfully updated'};
}

async function deleteLogEntries(ids, userId, date) {
  const client = await pool.connect();

  const deleteLogsQuery = `
    DELETE FROM logs
    WHERE id = $1
    AND user_id = $2
    AND timestamp_added::date = date ($3);
  `

  for (let id of ids) {
    try {
      let values = [id, userId, date]
      await client.query(deleteLogsQuery, values)
    } catch(err) {
      console.log(err)
    }
  }
  client.release();

  return {message: 'Entries successfully deleted'};
}

module.exports = {
  deleteLogEntries,
  getLogEntries,
  updateLogEntries,
}