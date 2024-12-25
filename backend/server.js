// backend/server.js

const express = require('express');
const watcher = require('./utils/watcher');
require('dotenv').config()
const app = express();
const port = 3000;

const booksRouter = require('./routes/books');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', booksRouter);


watcher.initialize();

app.get('/status', (req, res) => {
  res.json(watcher.getStatus());
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});