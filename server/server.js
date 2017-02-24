//Link dependencies
var bodyParser = require('body-parser');
var config = require('./config.json');
var db_config = require('./connectors/db/db_connector_config.json');
var express = require('express');
var mongodb = require('mongodb');
var io = require('socket.io')();
var path = require('path');

//Connectors
var userConnector = require('./connectors/user/userConnector');
var pieceConnector = require('./connectors/piece/pieceConnector');

//Middleware definitions
var logging = function logging(req, res, next) {
    console.log(new Date().toLocaleTimeString() + ' | Address: "' + req.originalUrl + '" | IP: "' + req.ip + '"');
    next();
};

//Middleware bindings
var app = express();
app.use(bodyParser.json());
app.use(logging);
app.use(bodyParser.json());
app.use(userConnector);
app.use(pieceConnector);
app.use(express.static(path.join(__dirname, '/../', 'node_modules/semantic-ui-css/')));
app.use(express.static(path.join(__dirname, '/../', 'client'), {extensions: ['html']}));

//Connect to database
mongodb.MongoClient.connect(db_config.host, (err, db) => {
    if (err) {
        console.error('Failure connecting to database', err);
        return;
    }
    console.log('Connected to database:', db.s.databaseName);
    let dbTest = require('./connectors/db/dbRequestTest')(db);
    app.use(dbTest);
});

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