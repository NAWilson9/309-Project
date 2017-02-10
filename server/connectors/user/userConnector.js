
//Link dependencies
let config = require('./user_connector_config.json');
const router = require('express').Router();
const fs = require('fs');
const path = require('path');

// Helper functions could go here

//Routing
router.post(config.base_url + 'login', function (req, res) {
    let username = req.body.username;
    let password = req.body.password;

    if(!username || !password){
        res.statusCode = 400;
        res.send('Username or password not specified. Verify POST data.');
        return;
    }

    let access = config.users.find((user) => user.username === username);
    if(access && access.password === password){
        res.send(JSON.stringify({'username': username}));
    } else {
        res.statusCode = 401;
        res.send("Unapproved credentials");
    }
});

router.get(config.base_url + 'profile', function (req, res) {
    let username = req.query.username;

    if(!username){
        res.statusCode = 400;
        res.send('No username specified. Verify username query parameter.');
        return;
    }

    let access = config.users.find((user) => user.username === username);
    if(access){
        delete access.password;
        res.send(access);
    } else {
        res.statusCode = 404;
        res.send('User not found.');
    }
});

router.post(config.base_url + 'profile', function(req, res) {
    let username = req.query.username;
    if(!username){
        res.statusCode = 400;
        res.send('No username specified. Verify username query parameter.');
    } else if(!req.body){
        res.statusCode = 400;
        res.send('No user preferences specified. Verify POST data.')
    }

    // Todo: verifyObject()
    let access = config.users.find((user) => user.username === username);
    if(access){
        //Todo: Verify a user is allowed to submit
        config.users[config.users.indexOf(access)] = req.body;
        fs.writeFile(path.join(__dirname, '/user_connector_config.json'), JSON.stringify(config, null, 4), function(err){
            if(err) {
                console.log(err);
            } else{
                fs.readFile('user_connector_config.json', function(err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        config = JSON.parse(data);
                        res.send(JSON.stringify(config));
                    }
                });
            }
        });
    } else {
        res.statusCode = 400;
        res.send('User not found.');
    }
});

module.exports = function () {
    return router;
};