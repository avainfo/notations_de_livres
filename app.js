const express = require('express');
const {sign} = require("jsonwebtoken");
const User = require('./models/UserModel');
const connect = require('./utils/api')
const hash = require('./utils/hash');
require('dotenv').config();

const app = express();
const router = express.Router();

const cors = require('cors');
const routes = require("./utils/routes");

connect();

app.use(cors())

app.use(express.json());

for(let r of routes) {
	if(r.method === "post") {
		router.post(r.path, r.action())
	}
}

app.use('/api', router);

module.exports = app;
