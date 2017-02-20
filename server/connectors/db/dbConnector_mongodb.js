//Link dependencies
// let config = require('./db_connector_mongodb_config.json');
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

let db;
const dbConnector = {
    createUser: (user) => {
        let coll = db.collection('users');
        coll.insertOne(user)
            .then(
                (res) => console.log('Successfully added item:', JSON.stringify(res.ops, undefined, 2)),
                (err) => console.error('Error adding item:', err)
            );
    },
    getUser: (username, callback) => {
        let coll = db.collection('users');
        coll.findOne({username: username})
            .then(
                (res) => {
                    console.log('What');
                    callback(res);
                }, (err) => {
                    console.error('Error finding item:', err);
                    callback(err);
                }
            );
    },
    createPiece: (piece) => {
        let coll = db.collection('pieces');
        coll.insertOne(piece)
            .then(
                (res) => console.log('Successfully added item:', JSON.stringify(res.ops, undefined, 2)),
                (err) => console.error('Error adding item:', err)
            );
    },
    getPiece: (id) => {

    },
    getPiecesForUser: (username) => {

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
