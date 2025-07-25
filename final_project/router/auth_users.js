const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to check if the username is valid
const isValid = (username) => {
    console.log(`Checking if username is valid: ${username}`);
    return users.some(user => user.username === username);
};

// Function to authenticate user
const authenticatedUser  = (username, password) => {
    console.log(`Authenticating user: ${username}`);
    return users.some(user => user.username === username && user.password === password);
};

// Login route for registered users
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt for username: ${username}`);

    if (authenticatedUser (username, password)) {
        const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
        console.log(`Login successful for user: ${username}. Token generated: ${token}`);
        req.session.user = username; // Save username in session
        return res.status(200).json({ message: "Login successful", token });
    } else {
        console.log(`Login failed for user: ${username}. Invalid username or password.`);
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review; // Get review from query
    const username = req.session.user;

    console.log(`User  ${username} is attempting to add/modify a review for ISBN: ${isbn}`);
    /*
    if (!username) {
        console.log("Unauthorized access attempt. User not logged in.");
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }*/

    if (!review) {
        console.log("Review is required but not provided.");
        return res.status(400).json({ message: "Review is required." });
    }

    if (!books[isbn]) {
        console.log(`Book with ISBN: ${isbn} not found.`);
        return res.status(404).json({ message: "Book not found." });
    }

    // Add or modify the review
    if (!books[isbn].reviews[username]) {
        books[isbn].reviews[username] = review; // Add new review
        console.log(`New review added for ISBN: ${isbn} by user: ${username}`);
    } else {
        books[isbn].reviews[username] = review; // Modify existing review
        console.log(`Review modified for ISBN: ${isbn} by user: ${username}`);
    }

    return res.status(200).json({ message: "Review added/modified successfully." });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.user;

    console.log(`User  ${username} is attempting to delete a review for ISBN: ${isbn}`);
    /*
    if (!username) {
        console.log("Unauthorized access attempt. User not logged in.");
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }*/

    if (!books[isbn]) {
        console.log(`Book with ISBN: ${isbn} not found.`);
        return res.status(404).json({ message: "Book not found." });
    }

    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username]; // Delete the review
        console.log(`Review deleted for ISBN: ${isbn} by user: ${username}`);
        return res.status(200).json({ message: "Review deleted successfully." });
    } else {
        console.log(`Review not found for ISBN: ${isbn} by user: ${username}`);
        return res.status(404).json({ message: "Review not found." });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
