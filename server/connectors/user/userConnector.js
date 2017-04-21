//Link dependencies
let config = require('./user_connector_config.json');
const fs = require('fs');
const path = require('path');
const router = require('express').Router();

//Database variable
let db;

// Prepares a user object to be returned to a user.
// Deletes the password property from the user object
// and returns the updated object.
let userDataHandler = function(user){
    let updatedUser = Object.assign({}, user);
    delete updatedUser.password;
    return updatedUser;
};

// Handles GET requests to '/api/user/login'
// Expects query parameters of:
// - username: string
// - password: string
// Responds with user profile object upon successful authentication.
// Responds with 'Unapproved credentials.' otherwise.
router.post(config.base_url + 'login', function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    if(!username || !password){
        res.statusCode = 400;
        res.send('Username or password not specified. Verify POST data.');
        return;
    }

    db.getUserByUsername(username, (err, dbUser) => {
        if (err) {
            res.statusCode = 500;
            res.send('Error obtaining user data.');
            console.error(new Date().toLocaleTimeString() + ' | Unable to obtain user data.');
            console.error(err);
        } else {
            if (dbUser) {
                if (dbUser.password === password) {
                    res.send(userDataHandler(dbUser));
                    console.log(new Date().toLocaleTimeString() + ' | User | "' + username + '" successfully authenticated.');
                } else {
                    res.statusCode = 401;
                    res.send('Unapproved credentials.');
                    console.warn(new Date().toLocaleTimeString() + ' | User | "' + username + '" was denied access.');
                }
            } else {
                res.statusCode = 404;
                res.send('User does not exist.');
                console.warn(new Date().toLocaleTimeString() + ' | User | "' + username + '" does not exist.');
            }
        }
    });
});

// Handles GET requests to '/api/user/profile'
// Expects query parameter of:
// - username: string
// Responds with user profile object upon successful authentication.
// Responds with 'User not found.' otherwise.
router.get(config.base_url + 'profile', function (req, res) {
    let username = req.query.username;
    if(!username){
        res.statusCode = 400;
        res.send('No username specified. Verify username query parameter.');
        return;
    }

    db.getUserByUsername(username, (err, dbUser) => {
        if (err) {
            res.statusCode = 500;
            res.send('Error obtaining user data.');
            console.error(new Date().toLocaleTimeString() + ' | Unable to obtain user data.');
            console.error(err);
        } else {
            if (dbUser) {
                res.send(userDataHandler(dbUser));
                console.log(new Date().toLocaleTimeString() + ' | User | "' + username + '" found.');
            } else {
                res.statusCode = 404;
                res.send('User does not exist.');
                console.warn(new Date().toLocaleTimeString() + ' | User | "' + username + '" does not exist.');
            }
        }
    });
});

// Handles POST requests to '/api/user/profile'
// Expects query parameter of:
// - username: string
// Expects POST data of:
// - Updated user profile dictionary to save
// Responds with new user profile object upon successful authentication.
// Responds with 'User not found.' otherwise.
router.post(config.base_url + 'profile', function(req, res) {
    let userID = req.query.userID;
    if(!userID){
        res.statusCode = 400;
        res.send('No username specified. Verify username query parameter.');
        return;
    } else if(!req.body){
        res.statusCode = 400;
        res.send('No user preferences specified. Verify POST data.');
        return;
    }

    db.getUserByID(userID, (err, dbUser) => {
        if (err) {
            res.statusCode = 500;
            res.send('Error obtaining user data.');
            console.error(new Date().toLocaleTimeString() + ' | Unable to obtain user data.');
            console.error(err);
        } else {
            if (dbUser) {
                for (let prop in req.body) {
                    if (req.body.hasOwnProperty(prop) && dbUser.hasOwnProperty(prop)) {
                        dbUser[prop] = req.body[prop];
                    }
                }
                dbUser._id = userID;
                db.updateUser(dbUser, (err, newDbUser) => {
                    if (err) {
                        res.statusCode = 500;
                        res.send('Error updating user data.');
                        console.error(new Date().toLocaleTimeString() + ' | Unable to update user data.');
                        console.error(err);
                    } else {
                        res.send(userDataHandler(newDbUser));
                        console.log(new Date().toLocaleTimeString() + ' | User | User with userID "' + userID + '" successfully updated.');
                    }
                });
            } else {
                res.statusCode = 404;
                res.send('User does not exist.');
                console.warn(new Date().toLocaleTimeString() + ' | User with userID | "' + userID + '" does not exist.');
            }
        }
    });
});

router.post(config.base_url + 'register', function(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    if(!username || !password){
        res.statusCode = 400;
        res.send('Username or password not specified. Verify POST data.');
        return;
    }

    db.checkUsernameExists(username, (err, usernameExists) => {
        if (err) {
            res.statusCode = 500;
            res.send('Error checking for existence of username.');
            console.error(new Date().toLocaleTimeString() + ' | Unable to check existence of username.');
            console.error(err);
        } else {
            if (!usernameExists) {
                let newUser = {
                    username: username,
                    password: password,
                };
                db.createUser(newUser, (err, dbUser) => {
                    if (err) {
                        res.statusCode = 500;
                        res.send('Error saving new user data.');
                        console.error(new Date().toLocaleTimeString() + ' | Unable to save new user data.');
                        console.error(err);
                    } else {
                        res.send(userDataHandler(dbUser));
                        console.log(new Date().toLocaleTimeString() + ' | User | User "' + username + '" successfully created.');
                    }
                });
            } else {
                res.statusCode = 400;
                res.send('Username already in use.');
                console.warn(new Date().toLocaleTimeString() + ' | User | "' + username + '" is already in use.');
            }
        }
    });
});

module.exports = (database) => {
    db = require('../../db/dbConnector')(database);
    return router;
};