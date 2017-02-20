//Link dependencies
var config = require('./config.json');
var db_config = require('./connectors/db/db_connector_mongodb_config.json');
var express = require('express');
var path = require('path');
var mongodb = require('mongodb');
// var mongoose = require('mongoose');
var io = require('socket.io')();

//Connectors
var sampleConnector = require('./connectors/sampleConnector/sampleConnector')(io); //Todo

//Middleware definitions
var logging = function logging(req, res, next) {
    console.log(new Date().toLocaleTimeString() + ' | Address: "' + req.originalUrl + '" | IP: "' + req.ip + '"');
    next();
};
console.log(path.join(__dirname, 'node_modules/semantic-ui-css/'));

//Middleware bindings
var app = express();
app.use(logging);
app.use(sampleConnector); //Todo
app.use(express.static(path.join(__dirname, '/../', 'node_modules/semantic-ui-css/')));
app.use(express.static(path.join(__dirname, '/../', 'client'), {
    extensions: ['html']}));

//Connect to database
// mongoose.connect(db_config.host);
// console.log(mongoose);

//Starts the servers
mongodb.MongoClient.connect(db_config.host)
    .then((res) => {
        var dbTest = require('./connectors/db/db_test');
        app.use(dbTest);
        io.listen(app.listen(config.port, function () {
            console.log(new Date().toLocaleTimeString() + ' | ' + config.server_name + ' Express server running on port ' + config.port);
        }));
        console.log('Connected to database:', res.s.databaseName);
    }, (err) => {
        console.error('Failure connecting to database', err);
    });

//Socket routing
io.on('connection', function (socket) {
    console.log(new Date().toLocaleTimeString() + ' | A user has connected. | IP Address: ' + socket.handshake.address +  ' | Total users: ' + io.engine.clientsCount);

    socket.on('disconnect', function(){
        console.log(new Date().toLocaleTimeString() + ' | A user has disconnected. | IP Address: ' + socket.handshake.address +  ' | Total users: ' + io.engine.clientsCount);
    });
});