const Book = require("../models/BookModel");
const fs = require("node:fs");

function getBooks() {
	return async (req, res) => {
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
	return async (req, res) => {
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
	return async (req, res) => {
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
	return async (req, res) => {
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

function deleteBook() {
	return async (req, res) => {
		const book = await Book.findOne({_id: req.params.id});
		try {
			await Book.deleteOne({_id: req.params.id})
			const similarImages = await Book.find({imageUrl: book.imageUrl});
			if (similarImages.length === 0) {
				deleteFile(book.imageUrl.split("/").pop());
			}
			res.status(200).json({message: "Livre supprimé !"})
		} catch (e) {
			res.status(500).json({error: "Error"})
		}
	}
}

function rateBook() {
	return async (req, res) => {

		const book = await Book.findOne({_id: req.params.id});
		let averageRating = (book.ratings.reduce((a, b) => a + b.grade, 0) + req.body.rating) / (book.ratings.length + 1);

		await Book.updateOne({_id: req.params.id}, {
			$push: {
				ratings: {
					userId: req.body.userId,
					grade: req.body.rating
				}
			},
			averageRating: averageRating
		})
			.then(async () => res.status(201).json(await Book.findOne({_id: req.params.id})))
			.catch(error => res.status(500).json({error: error}));
	}
}

function deleteFile(fileName) {
	fs.unlink("./assets/" + fileName, (err) => {
		if (err) {
			console.error('Error deleting file:', err);
		}
	});
}

module.exports = {getBooks, getBestRating, addBook, updateBook, deleteBook, rateBook}