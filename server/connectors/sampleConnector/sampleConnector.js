
//Link dependencies
var config = require('./sample_connector_config_template.json');
var router = require('express').Router();

//Global socket.io object
var io;

// Helper functions could go here

//Routing
router.get('/api/sampleConnector', function (req, res) {
    res.send(config.some_key);
    io.emit(config.some_key)
});

module.exports = function (ioObj) {
    io = ioObj;
    return router;
};