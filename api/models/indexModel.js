const { pool } = require("../db.js");
const { prepareForDbUpdate } = require("../../src/services/EntryService.js");

async function getIndexEntries(userId) {
  const q = `
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
    WHERE food_index.user_id = ($1)
    ORDER BY food_index.name ASC;
  `;

  try {
    const dbResponse = await pool.query(q, [userId])
    return dbResponse.rows;
  } catch (err) {
    console.log(err.stack)
  }
}

async function updateIndexEntries(body, userId) {
  const client = await pool.connect();

  let preparedEntries = prepareForDbUpdate(body)
  
  for (let entry of preparedEntries) {
    try {
      await client.query('BEGIN')
      const foodIndexQuery = `
      UPDATE food_index
      SET
        name = $1,
        serving_by_weight = $2,
        weight_unit = $3,
        serving_by_volume = $4,
        volume_unit = $5,
        serving_by_item = $6
      WHERE food_index.id = $7; 
      `
      const foodIndexValues = [entry.name, entry.serving_by_weight, entry.weight_unit, entry.serving_by_volume,
      entry.volume_unit, entry.serving_by_item, entry.id]

      const res = await client.query(foodIndexQuery, foodIndexValues)

      const foodIndexMacroQuery = `
          UPDATE food_index_macro
          SET
            calories=$1,
            total_fat=$2,
            sat_fat=$3,
            trans_fat=$4,
            poly_fat=$5,
            mono_fat=$6,
            cholesterol=$7,
            sodium=$8,
            total_carbs=$9,
            total_fiber=$10,
            sol_fiber=$11,
            insol_fiber=$12,
            total_sugars=$13,
            added_sugars=$14,
            protein=$15
          WHERE food_index_macro.id=$16;
        `
      const foodIndexMacroValues = [entry.calories, entry.total_fat, entry.sat_fat,
      entry.trans_fat, entry.poly_fat, entry.mono_fat,
      entry.cholesterol, entry.sodium, entry.total_carbs,
      entry.total_fiber, entry.sol_fiber, body.insol_fiber,
      entry.total_sugars, entry.added_sugars, entry.protein, entry.id]

      await client.query(foodIndexMacroQuery, foodIndexMacroValues)

      const costQuery = `
      UPDATE cost
      SET
        cost_per_container=$1,
        servings_per_container=$2
      WHERE cost.id = $3;
    `
      const costValues = [entry.cost_per_container, entry.servings_per_container, entry.id]

      await client.query(costQuery, costValues)
      await client.query('COMMIT')

    } catch (err) {
      console.log('index model err: \n', err)
      await client.query('ROLLBACK')
      throw err
    } 
  }

  client.release()
  
  return 'success';
}

module.exports = {
    getIndexEntries,
    updateIndexEntries,
}