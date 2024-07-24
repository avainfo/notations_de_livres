const multer = require("multer");

const storage = multer({
	storage: multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, 'assets/')
		},
		filename: function (req, file, cb) {
			cb(null, file.originalname);
		}
	})
}).single("image");

module.exports = storage