const mongoose = require('mongoose');

async function connectDB() {
	await mongoose.connect("mongodb://127.0.0.1:27017/users")
		.then((e) => console.log("Connecté à la base de données"))
		.catch((e) => console.log(e));
}

module.exports = () => connectDB();