require("dotenv").config();

// Create a pool object using np. This will allow us to query the specified DB.
const { Pool } = require("pg")
const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT
})

module.exports = { pool }