const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  const isbn = req.params.isbn;
  const review = req.query.review;
  for (let key in books) {
    if (isbn == books[key].isbn) {
      books[key].reviews[req.user.data] = review;
      console.log("book review", books[key].reviews)
      return res.status(200).send("review added succuessufly");
    }
  }
  return res.status(404).json({ message: `book with ISBN ${isbn} notfound` });

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const sessionname = req.session.authorization["username"];
  console.log("sessionnme",sessionname);
  for (let key in books) {
    // test if the book with the isbn exist
    if (isbn == books[key].isbn) {
      // test if the authenticated have a review
      if (sessionname in books[key].reviews) {
       // if the authenticated user has alreday a review we can delete it
        delete books[key].reviews[sessionname];
        // console.log(books[key].reviews.sessionname)
        console.log("after i delete the review of the logger user", books[key]);
        return res.status(200).send("review deleted succesufly");

      } else {
        return res.status(404).send("you don't have any review yet make sure you added any review");
      }
    }
  }
  return res.status(404).json({ message: `book with ISBN ${isbn} notfound` });

});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
