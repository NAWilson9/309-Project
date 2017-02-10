//Link dependencies
var config = require('./config.json');
var express = require('express');
var path = require('path');
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