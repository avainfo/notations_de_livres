const express = require('express');
const User = require('./models/UserModel');
const connect = require('./utils/api')
const hash = require('./utils/hash');

const app = express();
const router = express.Router();

const cors = require('cors');

connect();

app.use(cors())

app.use(express.json());

router.post('/auth/signup', async (req, res, next) => {
	const email = req.body["email"];
	let password = req.body["password"];

	password = await hash(password);

	const user = new User({email, password});
	user.save()
		.then((e) => res.status(200).json({'message': e}))
		.catch((e) => res.status(401).json(e.errorResponse));

	res.status(200).json(req.body);
});

module.exports = app;
