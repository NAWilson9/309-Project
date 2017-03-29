//Link dependencies
const bodyParser = require('body-parser');
const config = require('./config.json');
const db_config = require('./db/db_connector_config.json');
const express = require('express');
const dbConnect = require('./db/dbConnector.js')();
const io = require('socket.io')();
const path = require('path');

//Connectors
const userConnector = require('./connectors/user/userConnector');
const pieceConnector = require('./connectors/piece/pieceConnector');
const boardConnector = require('./connectors/boardConnector/boardConnector');

//Middleware definitions
const logging = function logging(req, res, next) {
    console.log(new Date().toLocaleTimeString() + ' | Address: "' + req.originalUrl + '" | IP: "' + req.ip + '"');
    next();
};

//Middleware bindings
const app = express();
app.use(bodyParser.json());
app.use(logging);
app.use(userConnector);
app.use(pieceConnector);
app.use(boardConnector);
app.use(express.static(path.join(__dirname, '/../', 'node_modules/semantic-ui-css/')));
app.use(express.static(path.join(__dirname, '/../', 'client'), {extensions: ['html']}));

//Database (will be initialized in callback of dbConnect.connect below)
let db;
//Connect to database
dbConnect.connect(app, db_config.host, [
    //Place database dependent express middleware (as uncalled functions) in here
    // example:
    // userConnector,
    // pieceConnector,
    // gameboardConnector,

], (database) => {
    db = require('./db/dbConnector')(database);
});

//Starts the servers
io.listen(app.listen(config.port, function () {
    console.log(new Date().toLocaleTimeString() + ' | ' + config.server_name + ' Express server running on port ' + config.port);
}));

let usersSearching = []; //Todo: better name
let games = []; //Todo: better name


function gameIDGenerator(){
    let key = keyGen();
    while(games.includes(key)) key = keyGen();
    return key;
}

function keyGen(){
    let key = "game";
    const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    for(let i = 0; i < 10; i++ ){
        key += possible[Math.floor(Math.random() * possible.length)];
    }
    return key;
}

function getGameRoom(socket){
    return Object.keys(socket.adapter.rooms).find(function(room){
        return room.startsWith('game');
    });
}

//Socket routing
io.on('connection', function (socket) {
    console.log(new Date().toLocaleTimeString() + ' | A user has connected. | IP Address: ' + socket.handshake.address +  ' | Total users: ' + io.engine.clientsCount);

    socket.on('findGame', function(callback){
        if(usersSearching.length > 0){
            let roomName = gameIDGenerator();
            socket.join(roomName);
            usersSearching.shift().join(roomName);
            //Todo: Create new game instance
            io.in(roomName).emit('gameFound', null);
            console.log(new Date().toLocaleTimeString() + ' | A new game has been started.');
        } else {
            usersSearching.push(socket);
            // callback(true); //Todo: figure out what this should be
            console.log(new Date().toLocaleTimeString() + ' | A user has been added to the search queue.');
        }
    });

    socket.on('leaveGame', function () {
        let gameRoom = getGameRoom(socket);
        if(gameRoom){
            //Todo: Handle game logic
            let socketObj = io.sockets.adapter.rooms[gameRoom].sockets;
            for (let id of Object.keys(socketObj)) { //Removes all clients from the room.
                io.sockets.connected[id].leave(gameRoom);
            }
            console.log(new Date().toLocaleTimeString() + ' | A game has been ended.');
        }
    });

    socket.on('movePiece', function (data) {
       //Todo: handle game update
    });

    socket.on('chat', function(message){
        io.in(getGameRoom(socket)).emit('chat', message);
    });

    socket.on('disconnect', function(){
        console.log(new Date().toLocaleTimeString() + ' | A user has disconnected. | IP Address: ' + socket.handshake.address +  ' | Total users: ' + io.engine.clientsCount);
    });
});