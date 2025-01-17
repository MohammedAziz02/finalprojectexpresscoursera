const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      users.push({ "username": username, "password": password });
      console.log(users);
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(res.status(200).json(books))
    }, 1000)
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      for (let key in books) {
        if (isbn == books[key].isbn) resolve(res.status(200).json(books[key]));
      }
      reject(res.status(404).json({ message: `book with ISBN ${isbn} notfound` }));
    }, 3000)

  })

});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  return new Promise(() => {
    setTimeout(() => {
      for (let key in books) {

        if (author == books[key].author) resolve(res.status(200).json(books[key]));
      }
      reject(res.status(404).json({ message: `book with author ${author} notfound` }));
    }, 3000)
  })

});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  return new Promise(() => {
    setTimeout(() => {
      for (let key in books) {

        if (title == books[key].title) resolve(res.status(200).json(books[key]));
      }
      reject(res.status(404).json({ message: `book with title ${title} notfound` }));
    }, 3000)
  })

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  for (let key in books) {
    // search for the  book with the appropriate isbn
    if (isbn == books[key].isbn) {
      // if found we retrive the reviews and we send it as a response
      const reviews = books[key].reviews;
      return res.status(200).json(reviews);
    }
  }
  // if not found the book we send a message in response
  return res.status(404).json({ message: `book with ISBN ${isbn} notfound` });
});

module.exports.general = public_users;
