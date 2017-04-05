//Link dependencies
const bodyParser = require('body-parser');
const config = require('./config.json');
const db_config = require('./db/db_connector_config.json');
const express = require('express');
const dbConnect = require('./db/dbConnector.js')();
const io = require('socket.io')();
const path = require('path');
const Game = require('./game/Game').Game;

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

//The games that are currently being played.
//Each item in teh array is a game object instance.
let activeGames = [];

//The users currently searching for a game.
//Each item in the array is the user's socket instance.
let usersInQueue = [];

//Returns a unique generated game ID.
function createRoomID(){
    let key = keyGen();
    while(Object.keys(io.sockets.adapter.rooms).includes(key)) key = keyGen();
    return key;
}

//Returns the game instance of the game the socket is currently in.
function getGameInstance(socket){
    for(let game of activeGames){
        if(game.players.playerTop.userData._id === socket.guid) return game;
        else if(game.players.playerBottom.userData._id === socket.guid) return game;
    }
}

//Returns the name of the game room the socket is currently in.
function getGameRoomName(socket){
    return Object.keys(socket.adapter.rooms).find(function(room){
        return room.startsWith('game');
    });
}

//Returns a randomly generated 14 character string, starting with 'game'.
function keyGen(){
    let key = 'game';
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for(let i = 0; i < 10; i++ ){
        key += possible[Math.floor(Math.random() * possible.length)];
    }
    return key;
}

//Socket routing
io.on('connection', function (socket) {
    console.log(new Date().toLocaleTimeString() + ' | A user has connected. | IP Address: ' + socket.handshake.address +  ' | Total users: ' + io.engine.clientsCount);

    //Used to find a game for a user.
    //If there is nobody else looking for a game, places user in queue.
    //If there is someone else looking for a game, creates a new game,
    //places both users in it, and emits game state to the room on the
    //'gameFound' route.
    //
    //Takes in a guid, which is an ID unique to the user, and
    //an optional callback that is called without arguments
    //when a user is placed into the queue.
    socket.on('findGame', function(guid, callback){
        //Store easily identifiable guid on socket object.
        socket.guid = 'generic' + guid; //Todo
        if(usersInQueue.length > 0){
            //Create and fetch data.
            let otherSocket = usersInQueue.shift();
            let roomName = createRoomID();
            let newGame = new Game({
                db: db,
                userIDs: [
                    socket.guid,
                    otherSocket.guid,
                ]
            });

            //Move sockets into room and push new game state.
            socket.join(roomName);
            otherSocket.join(roomName);
            io.in(roomName).emit('gameFound', newGame.getGameState());

            //Store new game.
            activeGames.push(newGame);

            console.log(new Date().toLocaleTimeString() + ' | A new game has been started.');
        } else {
            usersInQueue.push(socket);
            if(callback) callback();

            console.log(new Date().toLocaleTimeString() + ' | A user has been added to the search queue.');
        }
    });

    //Used to remove a user from the search queue.
    socket.on('leaveQueue', function(){
        leaveQueue(socket);
    });

    //Used to handle a user leaving a game.
    socket.on('leaveGame', function () {
        leaveGame(socket);
    });

    //Used to move a game piece.
    //Updates game state and then emits to room at the 'updateGameState' route.
    socket.on('movePiece', function (movement) {
        let game = getGameInstance(socket);
        game.movePiece(movement);

        //Todo: Add check for movePiece return value to determine if this emit should happen.
        io.in(getGameRoomName(socket)).emit('updateGameState', game.getGameState());
    });

    //Forwards chat messages to the entire room.
    socket.on('sendMessage', function(message){
        // Todo:
        // This only forwards the chat messages. Validation should be
        // added to ensure a user does not try to spoof their username, etc.
        io.in(getGameRoomName(socket)).emit('chatMessage', message);
    });

    //Removes a user from search queue and a game if they're in either.
    socket.on('disconnect', function(){
        try {
            leaveQueue(socket);
            leaveGame(socket)
        } catch (e){}

        console.log(new Date().toLocaleTimeString() + ' | A user has disconnected. | IP Address: ' + socket.handshake.address +  ' | Total users: ' + io.engine.clientsCount);
    });
});

//Used to handle a user leaving a game.
//Emits to the game room that a player has left on the 'playerLeft' route,
//then removes all users from the room.
function leaveGame(socket){
    let roomName = getGameRoomName(socket);
    let thisGame = getGameInstance(socket);

    //Tell all clients in the room that a player left.
    io.in(roomName).emit('playerLeft');

    //Todo: Record game state and such with the db. idk.

    //Removes all clients from the room.
    let socketsInRoom = io.sockets.adapter.rooms[roomName].sockets;
    for (let client of Object.keys(socketsInRoom)) {
        io.sockets.connected[client].leave(roomName);
    }

    //Remove game instance.
    activeGames = activeGames.filter(function (game) {
        return game !== thisGame;
    });

    console.log(new Date().toLocaleTimeString() + ' | A game has ended.');
}

//Used to remove a user from the search queue.
function leaveQueue(socket){
    usersInQueue = usersInQueue.filter(function (user) {
        return user !== socket;
    });

    console.log(new Date().toLocaleTimeString() + ' | A user has been removed from the search queue.');
}