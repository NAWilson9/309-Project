const db = require('./dbConnector_mongodb');

let user = {
    username: 'Jorge',
    password: '1234'
};

db.createUser(user);