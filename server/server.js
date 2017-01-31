//Link dependencies
var config = require('./config.json');
var express = require('express');
var io = require('socket.io')();

//Connectors
var sampleConnector = require('./connectors/sampleConnector/sampleConnector')(io); //Todo

//Middleware definitions
var logging = function (req, res, next) {
    console.log(new Date().toLocaleTimeString() + ' | Address: "' + req.originalUrl + '" | IP: "' + req.ip + '"');
    next();
};

//Middleware bindings
var app = express();
app.use(logging);
app.use(sampleConnector); //Todo
app.use(express.static('../client/', {
    extensions: ['html']}));

//Starts the servers
io.listen(app.listen(config.port, function () {
    console.log(new Date().toLocaleTimeString() + ' | ' + config.server_name + ' Express server running on port ' + config.port);
}));

//Socket routing
io.on('connection', function (socket) {
    console.log(new Date().toLocaleTimeString() + ' | A user has connected. | IP Address: ' + socket.handshake.address +  ' | Total users: ' + io.engine.clientsCount);

    socket.on('disconnect', function(){
        console.log(new Date().toLocaleTimeString() + ' | A user has disconnected. | IP Address: ' + socket.handshake.address +  ' | Total users: ' + io.engine.clientsCount);
    })
});