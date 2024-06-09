const express = require('express');
const bodyParser = require('body-parser');
var login = express.Router();
const rbooks = require('..//model/book');


login.get('/login', (req, res) => {
    res.render('pages/login');
});

login.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Retrieve the "users" collection from MongoDB

    let database = await rbooks.getDatabase();
    const usersCollection = database.collection('users');

    // Find a user with the provided username
    const user = await usersCollection.findOne({ username });

    if (user) {
        // Compare provided password with stored password
        if (user.password === password) {
            // Passwords match, redirect to welcome page
            res.redirect('book/add_book');
        } else {
            // Passwords do not match, render login page with error message
           // res.render('pages/login', { alert: 'Invalid password.' });
           return res.render("pages/login", {
            message: 'incorrect password!'
        })
        }
    } else {
        // No user found with the provided username, render login page with error message
        //res.render('pages/login', { alert: 'User not found.' });
        return res.render("pages/login", {
            message: 'User registered!'
        })

    }
});



module.exports = login;

