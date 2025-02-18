const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();
console.log(process.env);

const app = express();
const port = 3001;

const db = require('./db');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/auth/register/', db.registerUser)
app.post('/auth/login/', db.loginUser)
app.get('/tasks', db.authToken, db.getTasks)
app.post('/tasks', db.authToken, db.createTask)
app.put('/tasks/:id', db.authToken, db.updateTask)
app.delete('/tasks/:id', db.authToken, db.deleteTask)

app.listen(port, () => {
  console.log(`API listening on port ${port}`)
})