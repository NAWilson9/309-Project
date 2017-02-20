const db = require('./dbConnector_mongodb');
// const path = require('path');
const router = require('express').Router();

let user1 = {
    username: 'Jorge',
    password: '1234'
};
let user2 = {
    username: 'Alf',
    password: '1234'
};

router.post('/dbtest', (req, res) => {
    if (req.body){
        db.createUser(JSON.parse(req.body));
    }
});

console.log(db);

module.exports = router;

// db.createUser(user1);
// db.createUser(user2);