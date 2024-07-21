const express = require('express');
const connect = require('./utils/api')
const auth = require('./middleware/auth');
const multer = require('multer');
const cors = require('cors');
const routes = require("./utils/routes");

require('dotenv').config();

const app = express();
const router = express.Router();

connect();

app.use(cors())

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'assets/')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});

app.use('/assets', express.static('assets'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

routes.forEach(r => {
	const middlewares = [];
	if (r.auth) middlewares.push(auth);
	if (r.file) middlewares.push(multer({storage: storage}).single("image"));
	router[r.method](r.path, ...middlewares, r.action());
});

app.use('/api', router);

module.exports = app;
