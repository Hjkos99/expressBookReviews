const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
}

// Function to authenticate user based on username and password
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

const JWT_SECRET = "your_jwt_secret_key";

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the user exists and password matches
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token for the user
    const token = jwt.sign({ username: username }, JWT_SECRET, { expiresIn: '1h' });

    // Return the token to the client
    res.json({ message: "Login successful", token: token });
});

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token.split(' ')[1], JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user; // Store the user information for use in the request
        next();
    });
};

// Add a book review
regd_users.put("/auth/review/:isbn", authenticateToken, (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username;

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Initialize reviews object if it doesn't exist
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or modify the review for the given ISBN and username
    books[isbn].reviews[username] = review;

    res.json({ message: "Review added or updated successfully", reviews: books[isbn].reviews });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", authenticateToken, (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    // Check if the book with the given ISBN exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if there is a review by the user for the given ISBN
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found for this user" });
    }

    // Delete the review for the given user
    delete books[isbn].reviews[username];

    res.json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
