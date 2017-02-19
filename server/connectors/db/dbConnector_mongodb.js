//Link dependencies
let config = require('./db_connector_mongodb_config.json');
const mongodb = require('mongodb');

//Connect to database and run operations
const run = function(ops) {
    mongodb.MongoClient.connect(config.host, (err, db) => {
        if (err) console.error('Error connecting to database:', err);
        ops(db);
    });
};

const dbConnector = {
    createUser: (user) => {
        let ops = (db) => {
            let coll = db.collection('users');
            coll.insertOne(user)
                .then(
                    (res) => console.log('Successfully added item:', res.ops),
                    (err) => console.error('Error adding item:', err)
                );
        };
        run(ops);
    },
    getUser: (username) => {

    },
    createPiece: (username, piece) => {

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

module.exports = dbConnector;