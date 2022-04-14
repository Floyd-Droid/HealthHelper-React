const { pool } = require("../db.js");

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

module.exports = {
    getIndexEntries
}