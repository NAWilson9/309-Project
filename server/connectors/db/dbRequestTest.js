// const path = require('path');
const router = require('express').Router();

let db;
router.post('/dbtest/user', (req, res) => {
    if (req.body) {
        db.createUser(req.body, (err, user) => {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                res.send('Error saving user data');
            } else res.send(user);
        });
    }
});
router.get('/dbtest/user', (req, res) => {
    db.getUser(req.query.username, (err, user) => {
        if (err) {
            console.error(err);
            res.statusCode = 500;
            res.send('Database error');
        }
        else if (user) res.send(user);
        else {
            res.statusCode = 404;
            res.send('User not found');
        }
    });
});
router.post('/dbtest/piece', (req, res) => {
    if (req.body) {
        db.createPiece(req.body, (err, piece) => {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                res.send('Error saving piece data');
            } else res.send(piece);
        });
    }
});
router.get('/dbtest/piece', (req, res) => {
    let username = req.query.username;
    let id = req.query.id;
    if (username){
        db.getPiecesForUser(username, (pieces) => {
            if (pieces) {
                res.send(pieces);
            } else {
                res.statusCode = 404;
                res.send('Piece not found');
            }
        });
    }
    if (id) {
        db.getPiece(id, (piece) => {
            if (piece) {
                res.send(piece);
            } else {
                res.statusCode = 404;
                res.send('Piece not found');
            }
        });
    }
});

module.exports = (database) => {
    db  = require('./dbConnector')(database);
    return router;
};