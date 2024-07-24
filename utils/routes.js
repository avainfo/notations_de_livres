const {signup, login} = require("../controllers/UserController");
const {getBestRating, getBooks, addBook, updateBook, deleteBook, rateBook} = require("../controllers/BookController");

const routes = [
	{method: "post", path: "/auth/signup", action: signup, auth: false, file: false},
	{method: "post", path: "/auth/login", action: login, auth: false, file: false},
	{method: "get", path: "/books/bestrating", action: getBestRating, auth: false, file: false},
	{method: "get", path: "/books", action: getBooks, auth: false, file: false},
	{method: "get", path: "/books/:id", action: getBooks, auth: false, file: false},
	{method: "post", path: "/books", action: addBook, auth: true, file: true},
	{method: "put", path: "/books/:id", action: updateBook, auth: true, file: true},
	{method: "delete", path: "/books/:id", action: deleteBook, auth: true, file: false},
	{method: "post", path: "/books/:id/rating", action: rateBook, auth: true, file: false},
]

module.exports = routes;