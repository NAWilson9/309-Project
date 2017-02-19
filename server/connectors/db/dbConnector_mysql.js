//Link dependencies
const mysql = require('mysql');
const config = require('./db_connector_mysql_config.json');

//Connect to MYSQL Server
const connection = mysql.createConnection(JSON.parse(config));
connection.connect((err) => {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }
    console.log('Connected as id ' + connection.threadId);
});

const dbConnector = {
    createUser: (username, password) => {

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

module.exports(dbConnector);