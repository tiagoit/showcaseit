const express = require('express');
const screenshot = require('./screenshot');

const api = express();

api.post('/', (req, res) => {
  console.log(req.params['url'])
  // screenshot();
  res.send('Hello World!')
});

exports = api;
