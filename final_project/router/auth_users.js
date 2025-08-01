const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password)
    {
        return res.status(400).json({ message: "Username and password are required" });
    }
  
    if (!authenticatedUser(username, password))
    {
        return res.status(401).json({ message: "Invalid login credentials" });
    }
  
    // create JWT token
    const accessToken = jwt.sign({ username }, "access", { expiresIn: '1h' });
  
    // store in session
    req.session.authorization = { accessToken, username };
  
    return res.status(200).json({ message: "Login successful" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
  
    // ensure the user is authenticated via session
    const username = req.session.authorization?.username;
    if (!username)
    {
        return res.status(401).json({ message: "User not authenticated" });
    }
  
    // validate book existence
    if (!books[isbn])
    {
        return res.status(404).json({ message: "Book not found" });
    }
  
    // initialize review object if it doesn't exist
    if (!books[isbn].reviews)
    {
        books[isbn].reviews = {};
    }
  
    // add or update the review
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({ message: "Review added/modified successfully" });
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
  
    // ensure the user is authenticated via session
    const username = req.session.authorization?.username;
    if (!username)
    {
        return res.status(401).json({ message: "User not authenticated" });
    }
  
    // validate book existence
    if (!books[isbn])
    {
        return res.status(404).json({ message: "Book not found" });
    }
  
    // check if the user's review exists
    if (books[isbn].reviews && books[isbn].reviews[username])
    {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
    }
    else
    {
        return res.status(404).json({ message: "Review not found for this user" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
