/**
 * CHSS Piece Connector - by Lyle Lovig
 * @module pieceConnector
 */

//Link dependencies
let config = require('./piece_connector_config.json');
const fs = require('fs');
const path = require('path');
const router = require('express').Router();

//Routing
router.post('/api/pieces', function (req, res) {
    let id = req.body.id;
    if(Object.keys(req.body).length === 0){
        res.statusCode = 400;
        res.send("No body specified!");
        return;
    }
    if(!id){
        res.statusCode = 400;
        res.send("No id specified!");
        return;
    }
    let piece = config.pieces.find((piece) => piece.id === id);
    if(piece){
        config.pieces[config.pieces.indexOf(piece)] = req.body;
        fs.writeFile(path.join(__dirname, '/piece_connector_config.json'), JSON.stringify(config, null, 4), function(err){
            if(err) {
                res.statusCode = 500;
                res.send('Error saving new piece data.');
                console.error(new Date().toLocaleTimeString() + ' | Unable to save new piece data.');
                console.error(err);
            } else {
                res.send(config.pieces.find((piece) => piece.id === id));
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
                res.send(config.pieces[config.pieces.length-1]);
            }
        });
    }
});

router.get('/api/pieces', function (req, res) {
    let ids = req.query.id;
    if(ids) {
        ids = ids.split(',');
    }
    let creator = req.query.creator;
    if(!ids && !creator){
        res.statusCode = 400;
        res.send("No ids or creator specified!");
        return;
    }
    if(ids && creator){
        res.statusCode = 400;
        res.send("Both ids and creator specified");
        return;
    }
    let returnPieces = [];
    if(creator){
        config.pieces.forEach(function (piece) {
            if(piece.creator==creator){
                returnPieces.push(piece);
            }
        });
        if(returnPieces.length === 0){
            res.statusCode = 404;
            res.send("creator not found!");
            return;
        }
        res.send(returnPieces);
    }
    if(ids){
        config.pieces.forEach(function (piece) {
            for(let i = 0; i < ids.length; i++) {
                if (piece.id == ids[i]) {
                    returnPieces.push(piece);
                    return;
                }
            }
        });
        if(returnPieces.length === 0 || returnPieces.length != ids.length) {
            res.statusCode = 404;
            res.send("id/s not found!");
            return;
        }
        res.send(returnPieces);
    }
});

module.exports = router;

/** Documentation **/

/**
 * Helper function for post requests.
 *
 * If no ID is specified in the req body it sends an error to the client.
 * If an ID is specified it queries the server to see if a piece with the given ID exists.
 * If so the piece is updated, if not then the piece is created and stored.
 * Then the resulting updated or new piece is sent back to the client.
 * If an error is encountered then the error is sent to the client and execution stops.
 *
 * @callback module:pieceConnector~postPiecesCallback
 * @param req - contains the information for the request
 * @param res - the object to send results to
 */

/**
 * Helper function for get requests.
 *
 * If IDs are specified in the req body it queries the server to get the information for each piece with a specified ID.
 * If one is not found then an error is sent to the requesting client and execution stops.
 * Otherwise all the pieces information is sent back to the client.
 * If a creator is specified it queries the server for all pieces created by that user.
 * If none are found it sends an error to the client.
 * Otherwise it sends the found pieces information to the client.
 *
 * @callback module:pieceConnector~getPiecesCallback
 * @param req - contains the information for the request
 * @param res - the object to send results to
 */