const hash = require("./Hash");
const User = require("../models/UserModel");
const {sign} = require("jsonwebtoken");

const routes = [
	{method: "post", path: "/auth/signup", action: signup},
	{method: "post", path: "/auth/login", action: login},
	{method: "post", path: "/auth/signup", action: signup, auth: false},
	{method: "post", path: "/auth/login", action: login, auth: false},
]

function signup() {
	return async (req, res, next) => {
		const email = req.body["email"];
		let password = req.body["password"];

		password = await hash(password);

		const user = new User({email, password});
		user.save()
			.then((e) => res.status(200).json({'message': e}))
			.catch((e) => res.status(401).json(e.errorResponse));
	};
}

function login() {
	return async (req, res, next) => {
		const email = req.body["email"];
		let password = await hash(req.body["password"]);

		User.findOne({email: email})
			.then(user => {
				if (!user) {
					res.status(401).json({error: 'Utilisateur non trouvé !'});
				}
				if (password !== user.password) {
					res.status(401).json({error: 'Mot de passe incorrect !'});
				} else {
					res.status(200).json({
						userId: user._id,
						token: sign({
							userId: user._id
						}, process.env.JWT_SECRET, {
							expiresIn: '24h'
						})
					});
				}
			})
			.catch(error => res.status(500).json({error}));
	};
}

module.exports = routes;