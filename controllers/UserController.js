const hash = require("../utils/Hash");
const User = require("../models/UserModel");
const {sign} = require("jsonwebtoken");


function signup() {
	return async (req, res) => {
		const email = req.body["email"];
		let password = await hash(req.body["password"]);

		new User({email, password}).save()
			.then((e) => res.status(200).json({'message': e}))
			.catch((e) => res.status(401).json(e.errorResponse));
	};
}

function login() {
	return async (req, res) => {
		const email = req.body["email"];
		let password = await hash(req.body["password"]);

		User.findOne({email: email})
			.then(user => {
				if (!user) {
					res.status(401).json({error: 'Utilisateur non trouvé !'});
				} else if (password !== user.password) {
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

module.exports = {signup, login}