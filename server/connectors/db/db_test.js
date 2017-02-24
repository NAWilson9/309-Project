// const path = require('path');
const router = require('express').Router();

let db;
router.post('/dbtest/user', (req, res) => {
    if (req.body) {
        db.createUser(req.body);
        res.send(req.body);
    }
});
router.get('/dbtest/user', (req, res) => {
    db.getUser(req.query.username, (err, user) => {
        if (user)
        {
            res.send(user);
        } else {
            res.statusCode = 404;
            res.send('User not found');
        }
    });
});
router.post('/dbtest/piece', (req, res) => {
    if (req.body) {
        db.createPiece(req.body);
        res.send(req.body);
    }
});
router.get('/dbtest/piece', (req, res) => {
    let username = req.query.username;
    let id = req.query.id;
    if (username){
        db.getPiecesForUser(username, (pieces) => {
            if (pieces)
            {
                res.send(pieces);
            } else {
                res.statusCode = 404;
                res.send('Piece not found');
            }
        });
    }
    if (id) {
        db.getPiece(id, (piece) => {
            if (piece)
            {
                res.send(piece);
            } else {
                res.statusCode = 404;
                res.send('Piece not found');
            }
        });
    }
});

module.exports = (database) => {
    db  = require('./dbConnector_mongodb')(database);
    return router;
};