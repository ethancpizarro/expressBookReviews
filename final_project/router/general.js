const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    // validate input
    if (!username || !password)
    {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // check if user already exists
    const userExists = users.some(user => user.username === username);
    if (userExists)
    {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    // register the new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try
    {
        // make an HTTP GET request to my own server's book list endpoint
        const response = await axios.get('http://localhost:5000/');
        const bookList = response.data;

        return res.status(200).send(JSON.stringify(bookList, null, 4));
    }
    catch (err)
    {
        return res.status(500).json({ message: "Failed to retrieve book list" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try
    {
        // make an HTTP GET request to my own server's ISBN endpoint
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        const bookData = response.data;
        return res.status(200).json(bookData);
    }
    catch (err)
    {
        // handle errors such as 404 or server errors
        if (err.response && err.response.status === 404)
        {
            return res.status(404).json({ message: "Book not found" });
        }
        else
        {
            return res.status(500).json({ message: "Error retrieving book details" });
        }
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try
    {
        // make an HTTP GET request to my own server's author endpoint
        const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
        const booksByAuthor = response.data;
        return res.status(200).json(booksByAuthor);
    }
    catch (err)
    {
        if (err.response && err.response.status === 404)
        {
            return res.status(404).json({ message: "No books found for this author" });
        }
        else
        {
            return res.status(500).json({ message: "Error retrieving books by author" });
        }
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    try
    {
        // make an HTTP GET request to my own server's title endpoint
        const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
        const booksByTitle = response.data;
        return res.status(200).json(booksByTitle);
    }
    catch (err)
    {
        if (err.response && err.response.status === 404)
        {
            return res.status(404).json({ message: "No books found with this title" });
        }
        else
        {
            return res.status(500).json({ message: "Error retrieving books by title" });
        }
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn])
    {
        return res.status(200).json(books[isbn].reviews);
    }
    else
    {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
