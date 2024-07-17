const express = require('express');
const connect = require('./utils/api')

const app = express();

const cors = require('cors');

connect();

app.use(cors())

module.exports = app;
