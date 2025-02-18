const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

const db = require('db');

app.use(cors());

app.post('/auth/register/', db.registerUser)
app.post('/auth/login/', db.loginUser)
app.get('/tasks', db.getTasks)
app.post('/tasks', db.createTask)
app.put('/tasks/:id', db.updateTask)
app.delete('/tasks/:id', db.deleteTask)

app.listen(port, () => {
  console.log(`API listening on port ${port}`)
})