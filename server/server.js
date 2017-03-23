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

//Socket routing
io.on('connection', function (socket) {
    console.log(new Date().toLocaleTimeString() + ' | A user has connected. | IP Address: ' + socket.handshake.address +  ' | Total users: ' + io.engine.clientsCount);

    socket.on('/movePiece', function(data){
       console.log('MOVEPIECE: ' + JSON.stringify(data));
    });

    socket.on('disconnect', function(){
        console.log(new Date().toLocaleTimeString() + ' | A user has disconnected. | IP Address: ' + socket.handshake.address +  ' | Total users: ' + io.engine.clientsCount);
    });
});