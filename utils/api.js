const mongoose = require('mongoose');

async function connectDB() {
	await mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.gt24oyi.mongodb.net/users`)
		.then(() => console.log("Connecté à la base de données"))
		.catch((e) => console.error(e));
}

module.exports = () => connectDB();