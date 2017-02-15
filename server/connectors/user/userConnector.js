//Link dependencies
let config = require('./user_connector_config.json');
const fs = require('fs');
const path = require('path');
const router = require('express').Router();

// Prepares a user object to be returned to a user.
// Deletes the password property from the user object
// and returns the updated object.
let userDataHandler = function(user){
    delete user.password;
    return user;
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

    let user = config.users.find((user) => user.username === username && user.password === password);
    if(user){
        res.send(JSON.stringify(userDataHandler(user)));
        console.log(new Date().toLocaleTimeString() + ' | User | "' + username + '" successfully authenticated.');
    }
    else {
        res.statusCode = 401;
        res.send('Unapproved credentials.');
        console.warn(new Date().toLocaleTimeString() + ' | User | "' + username + '" was denied access.');
    }
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

    let user = config.users.find((user) => user.username === username);
    if(user) res.send(userDataHandler(user));
    else {
        res.statusCode = 404;
        res.send('User not found.');
        console.warn(new Date().toLocaleTimeString() + ' | User | "' + username + '" was not found.');
    }
});

// Handles POST requests to '/api/user/profile'
// Expects query parameter of:
// - username: string
// Expects POST data of:
// - Updated user profile dictionary to save
// Responds with new user profile object upon successful authentication.
// Responds with 'User not found.' otherwise.
router.post(config.base_url + 'profile', function(req, res) {
    let username = req.query.username;
    if(!username){
        res.statusCode = 400;
        res.send('No username specified. Verify username query parameter.');
        return;
    } else if(!req.body){
        res.statusCode = 400;
        res.send('No user preferences specified. Verify POST data.');
        return;
    }

    let user = config.users.find((user) => user.username === username);
    if(!user){
        res.statusCode = 400;
        res.send('User not found.');
        console.warn(new Date().toLocaleTimeString() + ' | User | "' + username + '" was not found.');
    } else {
        config.users[config.users.indexOf(user)] = req.body;
        fs.writeFile(path.join(__dirname, '/user_connector_config.json'), JSON.stringify(config, null, 4), function(err){
            if(err) {
                res.statusCode = 500;
                res.send('Error saving new user data.');
                console.error(new Date().toLocaleTimeString() + ' | Unable to save new user data.');
                console.error(err);
            } else {
                fs.readFile(path.join(__dirname, '/user_connector_config.json'), function(err, data) {
                    if (err) {
                        res.statusCode = 500;
                        res.send('Error reading newly saved user data');
                        console.error(new Date().toLocaleTimeString() + ' | Unable to read newly saved user data.');
                        console.log(err);
                    } else {
                        config = JSON.parse(data);
                        res.send(JSON.stringify(config));
                    }
                });
            }
        });
    }
});

module.exports = router;