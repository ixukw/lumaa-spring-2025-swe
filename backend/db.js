const {Pool} = require('pg');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

dotenv.config();

// initialize the pool for querying the database
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PW,
  port: process.env.DB_PORT,
});
pool.connect();

/**
 * JWT Token Authentication
 * @param {Object} req request
 * @param {Object} res response
 * @param {Function} callback callback function if auth successful
 */
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

/**
 * Endpoint for user register
 * @param {Object} req request
 * @param {Object} res response
 */
exports.registerUser = async (req, res) => {
  const {username, password} = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const {rows} = await pool.query('insert into users (username, password) values ($1,$2) returning *', [username, hashedPassword]);
    res.status(201).send('successfully registered user');
  } catch (error) {
    console.error('\nError in registerUser:', error.stack);
  }
}

/**
 * Endpoint for user login
 * @param {Object} req request
 * @param {Object} res response
 */
exports.loginUser = async (req, res) => {
  const {username, password} = req.body;
  try {
    const {rows} = await pool.query('select * from users where username = $1', [username]);
    if (rows) {
      const passwordsMatch = await bcrypt.compare(password, rows[0].password);
      if (passwordsMatch) {
        const token = jwt.sign({username: rows[0].username}, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.status(200).json(token);
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.error('\nError in loginUser:', error.stack);
  }
}

/**
 * Endpoint for getting all tasks
 * @param {Object} req request
 * @param {Object} res response
 */
exports.getTasks = async (req, res) => {
  try {
    const {rows} = await pool.query('select * from tasks');
    res.status(200).json(rows);
  } catch (error) {
    console.error('\nError in getTasks:', error.stack);
  }
}

/**
 * Endpoint for creating a task
 * @param {Object} req request
 * @param {Object} res response
 */
exports.createTask = async (req, res) => {
  const {title, description, iscomplete} = req.body;
  try {
    const {rows} = await pool.query('insert into tasks (title, description, iscomplete) values ($1, $2, $3)', [title, description, iscomplete]);
    res.status(201).send('successfully created task');
  } catch (error) {
    console.error('\nError in createTask:',error.stack);
  }
}

/**
 * Endpoint for updating a task
 * @param {Object} req request
 * @param {Object} res response
 */
exports.updateTask = async (req, res) => {
  const {id} = req.params;
  const {title, description, iscomplete} = req.body;
  try {
    const {rows} = await pool.query('update tasks set title = $1, description = $2, iscomplete = $3 where id = $4', [title, description, iscomplete, id]);
    res.status(200).send('successfully updated task');
  } catch (error) {
    console.error('\nError in updateTask:',error.stack);
  }
}

/**
 * Endpoint for deleting a task
 * @param {Object} req request
 * @param {Object} res response
 */
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const {rows} = await pool.query('delete from tasks where id = $1', [id]);
    res.status(200).send('successfully deleted task');
  } catch (error) {
    console.error('\nError in deleteTask:',error.stack);
  }
}