//Link dependencies
const mysql = require('mysql');

//Connect to MYSQL Server
const connection = mysql.createConnection({
    host     : 'mysql.cs.iastate.edu',
    user     : 'dbu309sr4',
    password : 'YjhhN2FjODRh',
});
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