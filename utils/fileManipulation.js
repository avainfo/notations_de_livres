const fs = require("node:fs");

function deleteFile(fileName) {
	fs.unlink("./assets/" + fileName, (err) => {
		if (err) {
			console.error('Error deleting file:', err);
		}
	});
}

module.exports = deleteFile;