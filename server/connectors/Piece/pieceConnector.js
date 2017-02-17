
//Link dependencies
let config = require('./piece_connector_config.json');
const fs = require('fs');
const path = require('path');
const router = require('express').Router();

//Global socket.io object
var io;

// Helper functions could go here


//Routing
router.get('/api/pieceConnector', function (req, res) {
    res.send(config.some_key);
    io.emit(config.some_key)
});

router.post('/api/pieces', function(req, res) {
    let id = req.query.id;
    let name = req.body.name;
    let creator = req.body.creator;
    if(!id){
        res.statusCode = 400;
        res.send("No id or creator specified!");
        return;
    }

    let user = config.pieces.find((piece) => piece.id === id);
    if(user){
            user.name = name;
            user.creator = creator;
        fs.writeFile(path.join(__dirname, '/piece_connector_config.json'), JSON.stringify(config, null, 4), function(err){
            if(err) {
                res.statusCode = 500;
                res.send('Error saving new piece data.');
                console.error(new Date().toLocaleTimeString() + ' | Unable to save new piece data.');
                console.error(err);
            } else {
                res.send(config);
            }
        });


    }

    else {

        config.pieces[config.pieces.length] = req.body;
        fs.writeFile(path.join(__dirname, '/piece_connector_config.json'), JSON.stringify(config, null, 4), function(err){
            if(err) {
                res.statusCode = 500;
                res.send('Error saving new piece data.');
                console.error(new Date().toLocaleTimeString() + ' | Unable to save new piece data.');
                console.error(err);
            } else {
                res.send(config);
            }
        });

    }
    });



router.get('/api/pieces', function (req, res) {
    let id = req.query.id;
        if(id) {
            id = id.split(',');
        }

    let creator =  req.query.creator;
    if(!id && !creator){
        res.statusCode = 400;
        res.send("No id or creator specified!");
        return;
    }
    let returnPieces = [];
    console.log("Got here");
    if(!id){
        config.pieces.forEach(function (piece) {
            if(piece.creator==creator){
                returnPieces.push(piece);
                console.log("Found one piece");
            }
        });
        if(returnPieces == []){
            res.statusCode = 404;
            res.send("creator not found!")
        }
        res.send(returnPieces);
    }
    if(!creator){
        config.pieces.forEach(function (piece) {
            for(var i=0;i < id.length;i++) {
                if (piece.id == id[i]) {
                    returnPieces.push(piece);
                }
            }
        });
        if(returnPieces == []){
            res.statusCode = 404;
            res.send("id/s not found!")
        }
        res.send(returnPieces);
    }
});

module.exports = function (ioObj) {
    io = ioObj;
    return router;
};