/**
 * Database connection
 */

const {Pool} = require('pg');
// const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// dotenv.config();

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: 'localhost',
  database: 'lumaa',
  password: process.env.DATABASE_PW,
  port: 5432,
});

pool.connect();

exports.authToken = (req, res, callback) => {
  const authHeader = req.headers['authorization']
  const token = authHeader;

  if (token == null) {
    return res.sendStatus(401)
  }

  try {
    const result = jwt.verify(token, process.env.JWT_SECRET);
    req.user = result;
    callback();
  } catch (error) {
    res.sendStatus(403);
    console.error('\nError in authToken:',error.stack);
  }
}

exports.registerUser = async (req, res) => {
  const {username, password} = req.body;
  console.log(username, password);
  try {
    const {rows} = await pool.query('insert into users (username, password) values ($1,$2) returning *', [username, password]);
    res.status(201).send('successfully registered user');
  } catch (error) {
    console.error('\nError in registerUser:', error.stack);
  }
}

exports.loginUser = async (req, res) => {
  const {username, password} = req.body;
  try {
    const {rows} = await pool.query('select * from users where username = $1 and password = $2', [username, password]);
    console.log(rows);
    const token = jwt.sign({username: username}, process.env.JWT_SECRET, { expiresIn: '24h' })
    res.status(200).json(token);
  } catch (error) {
    console.error('\nError in loginUser:', error.stack);
  }
}

exports.getTasks = async (req, res) => {
  try {
    const {rows} = await pool.query('select * from tasks');
    res.status(200).json(rows);
  } catch (error) {
    console.error('\nError in getTasks:', error.stack);
  }
}

exports.createTask = async (req, res) => {
  const {title, description, isComplete} = req.body;
  console.log(req.body, title, description, isComplete);
  try {
    const {rows} = await pool.query('insert into tasks (title, description, isComplete) values ($1, $2, $3)', [title, description, isComplete]);
    res.status(201).send('successfully created task');
  } catch (error) {
    console.error('\nError in createTask:',error.stack);
  }
}

exports.updateTask = async (req, res) => {
  const {title, description, isComplete, id} = req.body;
  try {
    const {rows} = await pool.query('update tasks set title = $1, description = $2, isComplete = $3 where id = $4', [title, description, isComplete, id]);
    res.status(200).send('successfully updated task');
  } catch (error) {
    console.error('\nError in updateTask:',error.stack);
  }
}

exports.deleteTask = async (req, res) => {
  const {id} = parseInt(req.params.id);
  try {
    const {rows} = await pool.query('delete from tasks where id = $1', [id]);
    res.status(200).send('successfully deleted task');
  } catch (error) {
    console.error('\nError in deleteTask:',error.stack);
  }
}