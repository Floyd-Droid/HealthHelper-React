const { pool } = require("../db.js");
const { prepareForDbUpdate } = require("../../src/services/EntryService.js");

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
      return dbResponse.rows;
    } catch (err) {
      console.log(error)
    }
}

async function updateLogEntries(body, date, userId) {
  const client = await pool.connect();

  const preparedEntries = prepareForDbUpdate(body)

  for (let entry of preparedEntries) {
    try {
      await client.query('BEGIN')
      const updateLogsQuery = `
        UPDATE logs
        SET
          amount = $1,
          amount_unit = $2
        WHERE logs.id = $3
        AND logs.timestamp_added::date = date ($4)
        AND logs.user_id = $5; 
      `
      const logValues = [entry.amount, entry.amount_unit, entry.id, date, Number(userId)]

      const res = await client.query(updateLogsQuery, logValues)

    } catch (err) {
        console.log('log model err: \n', err)
        await client.query('ROLLBACK')
        throw err
    } 
  }

  client.release()

  return 'success';
}

module.exports = {
  getLogEntries,
  updateLogEntries,
}