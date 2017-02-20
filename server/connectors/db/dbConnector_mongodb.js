//Link dependencies
// let config = require('./db_connector_mongodb_config.json');
const mongodb = require('mongodb');

function Database() {
    // console.log(mongodb);
    this.db = mongodb.MongoClient.connection;
    console.log(mongodb.MongoClient.connection);
    this.createUser = (user) => {
        let coll = this.db.collection('users');
        coll.insertOne(user)
            .then(
                (res) => console.log('Successfully added item:', res.ops),
                (err) => console.error('Error adding item:', err)
            );
    };
}

//
// const dbConnector = {
//     d: () => {
//
//     },
//     getUser: (username) => {
//
//     },
//     createPiece: (username, piece) => {
//
//     },
//     getPiece: (id) => {
//
//     },
//     getPiecesForUser: (username) => {
//
//     },
//     createGameboard: (username, gameboard) => {
//
//     },
//     getGameboardForUser: (username) => {
//
//     },
// };


// mongodb.MongoClient.connect(config.host, (err, db) => {
//     if (err) console.error('Error connecting to database:', err);
//     else {
//         this.database = db;
//         callback();
//     }
// });

// mongodb.MongoClient.connect(config.host, (err, db) => {
//     if (err) return console.error('Error connecting to database:', err);
//     dbConnector.database = db;
// });

module.exports = new Database();