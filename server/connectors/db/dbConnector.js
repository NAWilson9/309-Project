//Link dependencies
// let config = require('./db_connector_config.json');
const mongodb = require('mongodb');

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
    username: Joi.string().required(),
    password: Joi.string().required()
});

const pieceSchema = Joi.object().keys({
    name: Joi.string().required(),
    creator: Joi.string().required()
});

const boardSchema = Joi.object().keys({
    name: Joi.string().required(),
    creator: Joi.string().required()
});

let db;
const dbConnector = {
    /**
     * Adds a given valid User object to database
     * @param user
     * User object to insert into database
     * @param callback
     * Called with error or result upon Promise return from database operation
     */
    createUser: (user, callback) => {
        let validation = Joi.validate(user, userSchema); //
        if (user)
        {
            let coll = db.collection('users');
            coll.insertOne(user)
                .then(
                    (res) => { if (callback) callback(undefined, res.ops[0]) },
                    (err) => { if (callback) callback(err) }
                );
        }
    },
    /**
     * Retrieves a desired User object from database
     * @param username
     * Username of User object to retrieve from database
     * @param callback
     * Called with error or result upon Promise return from database operation
     */
    getUser: (username, callback) => {
        if (username)
        {
            let coll = db.collection('users');
            coll.findOne({username: username})
                .then(
                    (res) => { if (callback) callback(undefined, res) },
                    (err) => { if (callback) callback(err) }
                );
        }
    },
    /**
     * Adds a given valid Piece object to database
     * @param piece
     * Piece object to insert into database
     * @param callback
     * Called with error or result upon Promise return from database operation
     */
    createPiece: (piece, callback) => {
        if (piece)
        {
            let coll = db.collection('pieces');
            coll.insertOne(piece)
                .then(
                    (res) => { if (callback) callback(undefined, res.ops[0]) },
                    (err) => { if (callback) callback(err) }
                );
        }
    },
    /**
     * Retrieves a desired Piece object from database
     * @param id
     * ID of Piece object to retrieve from database
     * @param callback
     * Called with error or result upon Promise return from database operation
     */
    getPiece: (id, callback) => {
        if (id)
        {
            let coll = db.collection('pieces');
            coll.findOne({id: id})
                .then(
                    (res) => { if (callback) callback(undefined, res) },
                    (err) => { if (callback) callback(err) }
                );
        }
    },
    /**
     * Retrieves all of the Piece objects created by a given User from database
     * @param username
     * User that created Piece object to retrieve from database
     * @param callback
     * Called with error or result upon Promise return from database operation
     */
    getPiecesForUser: (username, callback) => {
        if (username)
        {
            let coll = db.collection('pieces');
            coll.find({creator: username})
                .toArray((err) => { if (callback) callback(err) })
                .then(
                    (res) => { if (callback) callback(undefined, res) },
                    (err) => { if (callback) callback(err) }
                );
        }
    },
    /**
     * Adds a given valid Gameboard object to database
     * @param gameboard
     * Gameboard object to insert into database
     * @param callback
     * Called with error or result upon Promise return from database operation
     */
    createGameboard: (gameboard, callback) => {
        if (gameboard)
        {
            let coll = db.collection('gameboards');
            coll.insertOne(gameboard)
                .then(
                    (res) => { if (callback) callback(undefined, res.ops[0]) },
                    (err) => { if (callback) callback(err) }
                );
        }
    },
    /**
     * Retrieves the Gameboard object of a given User from database
     * @param username
     * User that created Gameboard object to retrieve from database
     * @param callback
     * Called with error or result upon Promise return from database operation
     */
    getGameboardForUser: (username, callback) => {
        if (username)
        {
            let coll = db.collection('gameboards');
            coll.findOne({creator: username})
                .then(
                    (res) => { if (callback) callback(undefined, res) },
                    (err) => { if (callback) callback(err) }
                );
        }
    },
};

module.exports = (database) => {
    db = database;
    return dbConnector;
};