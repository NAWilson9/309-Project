//Link dependencies
// let config = require('./db_connector_config.json');
// const mongodb = require('mongodb');

// function Database() {
//     // console.log(mongodb);
//     console.log(mongodb.MongoClient.connection);
//     this.createUser = (user) => {
//         let coll = this.db.collection('users');
//         coll.insertOne(user)
//             .then(
//                 (res) => console.log('Successfully added item:', res.ops),
//                 (err) => console.error('Error adding item:', err)
//             );
//     };
// }

const Joi = require('joi');

const userSchema = Joi.object().keys({
    username: Joi.string(),
    password: Joi.string()
});

const pieceSchema = Joi.object().keys({
    name: Joi.string(),
    creator: Joi.string()
});

const boardSchema = Joi.object().keys({
    name: Joi.string(),
    creator: Joi.string()
});

let db;
const dbConnector = {
    createUser: (user, callback) => {
        if (user)
        {
            let coll = db.collection('users');
            coll.insertOne(user)
                .then(
                    (res) => callback(undefined, res.ops[0]),
                    (err) => callback(err)
                );
        }
    },
    getUser: (username, callback) => {
        let coll = db.collection('users');
        coll.findOne({username: username})
            .then(
                (res) => callback(undefined, res),
                (err) => callback(err)
            );
    },
    createPiece: (piece) => {
        let coll = db.collection('pieces');
        coll.insertOne(piece)
            .then(
                (res) => console.log('Successfully added piece:', JSON.stringify(res.ops, undefined, 2)),
                (err) => console.error('Error adding item:', err)
            );
    },
    getPiece: (id, callback) => {
        let coll = db.collection('pieces');
        coll.findOne({id: id})
            .then(
                (res) => callback(undefined, res),
                (err) => callback(err)
            );
    },
    getPiecesForUser: (username, callback) => {
        let coll = db.collection('pieces');
        coll.find({creator: username})
            .toArray(
                (err) => (err) => callback(err))
            .then(
                (res) => callback(undefined, res),
                (err) => callback(err)
            );
    },
    createGameboard: (username, gameboard) => {

    },
    getGameboardForUser: (username) => {

    },
};

module.exports = (database) => {
    db = database;
    return dbConnector;
};