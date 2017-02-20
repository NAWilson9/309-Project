// const path = require('path');
const router = require('express').Router();

let db;
router.post('/dbtest', (req, res) => {
    if (req.body) {
        db.createUser(req.body);
        res.send(req.body);
    }
});
router.get('/dbtest', (req, res) => {
    db.getUser(req.query.username, (user) => {
        if (user)
        {
            res.send(user);
        } else {
            res.status('Unable to find user').send();
        }
    });
});

module.exports = (database) =>
    {
    db  = require('./dbConnector_mongodb')(database);
    return router;
};
