//Link dependencies
const bodyParser = require('body-parser');
const config = require('./config.json');
const db_config = require('./db/db_connector_config.json');
const express = require('express');
const mongodb = require('mongodb');
const db = require('./db/dbConnector.js')(undefined);
const io = require('socket.io')();
const path = require('path');

//Connectors
const userConnector = require('./connectors/user/userConnector');
const pieceConnector = require('./connectors/piece/pieceConnector');

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
app.use(express.static(path.join(__dirname, '/../', 'node_modules/semantic-ui-css/')));
app.use(express.static(path.join(__dirname, '/../', 'client'), {extensions: ['html']}));

//Connect to database
db.connect(app, db_config.host, [
    //Place database dependent modules (as uncalled function) in here
    // example:
    // userConnector,
    // pieceConnector,
    // gameboardConnector,

]);

//Starts the servers
io.listen(app.listen(config.port, function () {
    console.log(new Date().toLocaleTimeString() + ' | ' + config.server_name + ' Express server running on port ' + config.port);
}));

//Socket routing
io.on('connection', function (socket) {
    console.log(new Date().toLocaleTimeString() + ' | A user has connected. | IP Address: ' + socket.handshake.address +  ' | Total users: ' + io.engine.clientsCount);

    socket.on('disconnect', function(){
        console.log(new Date().toLocaleTimeString() + ' | A user has disconnected. | IP Address: ' + socket.handshake.address +  ' | Total users: ' + io.engine.clientsCount);
    });
});