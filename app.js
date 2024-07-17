const express = require('express');
const User = require('./models/UserModel');
const connect = require('./utils/api')
const hash = require('./utils/hash');

const app = express();

const cors = require('cors');

connect();

app.use(cors())

app.use(express.json());

app.post('/api/auth/signup', async (req, res, next) => {
	console.log(req.body);
	const email = req.body["email"];
	let password = req.body["password"];

	password = await hash(password);

	const user = new User({email, password});
	user.save();

	res.status(200).json(req.body);
});

module.exports = app;
