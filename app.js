const express = require('express');
const connect = require('./utils/api')
const auth = require('./middleware/auth');
const multer = require('multer');
const path = require('path');

require('dotenv').config();

const app = express();
const router = express.Router();

const cors = require('cors');
const routes = require("./utils/routes");

connect();

app.use(cors())

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'assets/')
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now();
		cb(null, uniqueSuffix + path.extname(file.originalname));
	}
});


const upload = multer({storage: storage});

app.use('/assets', express.static('assets'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/uploads', express.static('uploads'));

const setupRoute = (r, middlewares = []) => {
	router[r.method](r.path, ...middlewares, r.action());
};

routes.forEach(r => {
	const middlewares = [];
	if (r.auth) middlewares.push(auth);
	if (r.file) middlewares.push(upload.single("image"));
	setupRoute(r, middlewares);
});


app.use('/api', router);

module.exports = app;
