const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    const doesExist = (username) => {
        // Filter the users array for any user with the same username
        let userswithsamename = users.filter((user) => {
            return user.username === username;
        });
        // Return true if any user with the same username is found, otherwise false
        if (userswithsamename.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const booksListPromise = new Promise ((resolve,reject) => {
        setTimeout(() => {
            resolve("Promise solved")
        }, 4000);
    })
    console.log("Before calling booksListPromise!")
    
    booksListPromise.then((successMessage) => {
        console.log("From Callback" + successMessage)
    })

    console.log("After calling booksListPromise!")
    res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const isbnPromise = new Promise ((resolve,reject) => {
        setTimeout(() => {
            resolve("Promise solved")
        }, 6000);
    })
    console.log("Before calling isbnPromise!")
    
    isbnPromise.then((successMessage) => {
        console.log("From Callback" + successMessage)
    })

    console.log("After calling isbnPromise!")
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author
    const result = []

    // Obtain all keys for the 'books' object
    const booksByIsbn = Object.keys(books)
    
    // Iterate through each book and check if the author matches
    booksByIsbn.forEach((isbn) => {
        const book = books[isbn]
        if (book.author === author) {
            result.push(book)
        }
    });

    // Check if any books were found
    if (result.length > 0) {
        res.json(result);
    } else {
        res.status(404).json({ message: "No books found for the specified author" });
    }

    const authorPromise = new Promise ((resolve,reject) => {
        setTimeout(() => {
            resolve("Promise solved")
        }, 1500);
    })
    console.log("Before calling authorPromise!")
    
    authorPromise.then((successMessage) => {
        console.log("From Callback" + successMessage)
    })

    console.log("After calling authorPromise!")
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title
    const result = []

    const booksByIsbn = Object.keys(books)
    
    booksByIsbn.forEach((isbn) => {
        const book = books[isbn]
        if (book.title === title) {
            result.push(book)
        }
    });

    if (result.length > 0) {
        res.json(result);
    } else {
        res.status(404).json({ message: "No books found for the specified author" });
    }

    const titlePromise = new Promise ((resolve,reject) => {
        setTimeout(() => {
            resolve("Promise solved")
        }, 3000);
    })
    console.log("Before calling titlePromise!")
    
    titlePromise.then((successMessage) => {
        console.log("From Callback" + successMessage)
    })

    console.log("After calling titlePromise!")
    
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    // Check if the book with the given ISBN exists
    if (books[isbn]) {
        const reviews = books[isbn].reviews;
        res.json({ reviews: reviews });
    } else {
        res.status(404).json({ message: "No reviews found for the specified ISBN" });
    }
});

module.exports.general = public_users;
