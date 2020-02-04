const express = require('express');
const validator = require('validator');
const upload = require('./upload');
const screenshot = require('./screenshot');
const bodyParser = require('body-parser')

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('App Works');
});

app.post('/', async (req, res) => {
  let url = req.body.url;
  if(!url.includes('http')) url = 'http://' + url;
  if(!validator.isURL(url, {
    protocols: ['http','https'],
    require_protocol: true
  })) return res.send({ error: 'Invalid URL.' });

  const fileName = await screenshot(url);  

  const publicUrl = await upload(fileName);

  return res.send({ publicUrl });
});

module.exports = { app };
