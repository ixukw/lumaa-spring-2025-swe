/**
 * Database connection
 */
const {Pool} = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PW,
  port: 5432,
  connectionTimeoutMillis: 30000
});

exports.registerUser = (req, res) => {
  const {username, password} = req.body;

  try {
    const {rows} = pool.query('insert into users (username, password) values ($1,$2) returning *', [username, password]);
    res.status(201).send('')
  } catch (error) {
    console.error('\nError in registerUser:', error.stack);
  }
}