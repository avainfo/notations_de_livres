const express = require('express');
const {sign} = require("jsonwebtoken");
const User = require('./models/UserModel');
const connect = require('./utils/api')
const hash = require('./utils/hash');
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

for (let r of routes) {
	if (!r.auth) {
		switch (r.method) {
			case "post":
				if (!r.file) router.post(r.path, r.action())
				else router.post(r.path, (req, res, next) => {
					next()
				}, upload.single("image"), r.action())
				break;
			case "get":
				router.get(r.path, r.action())
				break;
		}
	} else {
		switch (r.method) {
			case "post":
				if (!r.file) router.post(r.path, auth, r.action())
				else router.post(r.path, ...[auth, upload.single("image"), r.action()])
				break;
			case "get":
				router.get(r.path, auth, r.action())
				break;
		}
	}
}

app.use('/api', router);

module.exports = app;
