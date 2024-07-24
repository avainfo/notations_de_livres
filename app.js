const express = require('express');
const connect = require('./utils/db')
const auth = require('./middleware/auth');
const cors = require('cors');
const routes = require("./utils/routes");
const storage = require("./middleware/storage");

require('dotenv').config();

const app = express();
const router = express.Router();

connect();

app.use(cors())

app.use('/assets', express.static('assets'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

routes.forEach(r => {
	const middlewares = [];
	if (r.auth) middlewares.push(auth);
	if (r.file) middlewares.push(storage);
	router[r.method](r.path, ...middlewares, r.action());
});

app.use('/api', router);

module.exports = app;
