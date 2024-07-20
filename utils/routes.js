const hash = require("./Hash");
const User = require("../models/UserModel");
const Book = require("../models/BookModel");
const {sign} = require("jsonwebtoken");

const routes = [
	{method: "post", path: "/auth/signup", action: signup, auth: false, file: false},
	{method: "post", path: "/auth/login", action: login, auth: false, file: false},
	{method: "get", path: "/books/bestrating", action: getBestRating, auth: false, file: false},
	{method: "get", path: "/books", action: getBooks, auth: false, file: false},
	{method: "get", path: "/books/:id", action: getBooks, auth: false, file: false},
	{method: "post", path: "/books", action: addBook, auth: true, file: true},
	{method: "put", path: "/books/:id", action: updateBook, auth: true, file: true},
]

function signup() {
	return async (req, res, next) => {
		const email = req.body["email"];
		let password = await hash(req.body["password"]);

		new User({email, password}).save()
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

function getBooks() {
	return async (req, res, next) => {
		if (!req.params.id) {
			Book.find()
				.then(books => {
					if (!books) {
						res.status(401).json({error: 'Aucun livre trouvé !'});
					} else {
						res.status(200).json(books);
					}
				})
				.catch(error => res.status(500).json({error}));
		} else {
			Book.findOne({_id: req.params.id})
				.then(book => {
					if (!book) {
						res.status(401).json({error: 'Livre non trouvé !'});
					} else {
						res.status(200).json(book);
					}
				})
				.catch(error => res.status(500).json({error}));
		}
	}
}


function getBestRating() {
	return async (req, res, next) => {
		Book.find()
			.sort({averageRating: -1})
			.limit(3)
			.then(books => {
				if (!books) {
					res.status(401).json({error: 'Aucun livre trouvé !'});
				} else {
					res.status(200).json(books);
				}
			})
			.catch(error => {
				res.status(500).json({error})
			});
	}
}

function addBook() {
	return async (req, res, next) => {
		let jsonBook = JSON.parse(req.body.book)
		delete jsonBook.userId;
		jsonBook.year = parseInt(jsonBook.year)

		const book = new Book({
			userId: req.auth.userId,
			...jsonBook,
			imageUrl: `${req.protocol}://${req.get('host')}/assets/${req.file.filename}`
		});

		book.save()
			.then(() => res.status(201).json({message: "Livre ajouté !"}))
			.catch(error => res.status(500).json({error: error}));
	}
}

function updateBook() {
	return async (req, res, next) => {
		let update;
		if (req.file) {
			let jsonBook = JSON.parse(req.body.book)
			delete jsonBook.userId;
			update = {
				...jsonBook,
				imageUrl: `${req.protocol}://${req.get('host')}/assets/${req.file.filename}`
			}
		} else {
			update = {
				...req.body
			}
		}
		Book.updateOne({_id: req.params.id}, update)
			.then(() => res.status(201).json({message: "Livre mis a jour !"}))
			.catch(error => res.status(500).json({error: error}));
	}
}

module.exports = routes;