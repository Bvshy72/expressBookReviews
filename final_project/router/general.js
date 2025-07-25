const express = require('express');
const axios = require('axios'); // Import Axios for making HTTP requests
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: "Username already exists." });
    }
    users.push({ username, password });
    return res.status(201).json({ message: "User  registered successfully." });
});

public_users.get('/books', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/books'); // Replace with your actual endpoint
        res.json(response.data); 
    } catch (error) {
        res.status(500).json({ message: "Error fetching book list." });
    }
});

public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000/books/isbn/${isbn}`); // Replace with your actual endpoint
        res.json(response.data); 
    } catch (error) {
        res.status(404).json({ message: "Book not found." });
    }
});

public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/books/author/${author}`); // Replace with your actual endpoint
        res.json(response.data); 
    } catch (error) {
        res.status(404).json({ message: "No books found for this author." });
    }
});

public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const response = await axios.get(`http://localhost:5000/books/title/${title}`); // Replace with your actual endpoint
        res.json(response.data); 
    } catch (error) {
        res.status(404).json({ message: "No books found with this title." });
    }
});

public_users.get('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000/books/review/${isbn}`); // Replace with your actual endpoint
        res.json(response.data); 
    } catch (error) {
        res.status(404).json({ message: "Book not found." });
    }
});

module.exports.general = public_users;
