//Link dependencies
let config = require('./piece_connector_config.json');
const fs = require('fs');
const path = require('path');
const router = require('express').Router();
//Routing
/*
Handles post requests to /api/pieces
Expects one parameter
- id: int

This takes in an id of a piece to update
If the id is found in the file it updates the piece information to the info specified
If the id is not found it creates a new piece with that id and specified info
 */
router.post('/api/pieces', function(req, res) {
    let id = req.query.id;
    if(!id){
        res.statusCode = 400;
        res.send("No id specified!");
        return;
    }
    let piece = config.pieces.find((piece) => piece.id === id);
    if(req.body == null){
        res.statusCode = 400;
        res.send("No body specified!");
        return;
    }
    if(piece){
        config.pieces[config.pieces.indexOf(piece)] = req.body;
        fs.writeFile(path.join(__dirname, '/piece_connector_config.json'), JSON.stringify(config, null, 4), function(err){
            if(err) {
                res.statusCode = 500;
                res.send('Error saving new piece data.');
                console.error(new Date().toLocaleTimeString() + ' | Unable to save new piece data.');
                console.error(err);
                return;
            } else {
                res.send(piece);
                return;
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
                res.send(piece);
            }
        });
    }
    });
/*
Handles get requests to /api/pieces
Expects two parameters
- ids: array of ints
- creator: string

This takes in ids of a piece or a creator of a piece.
If both ids and creator are specified we return an error asking for one or the other
If neither ids or creator are specified we return an error stating so
If ids are specified we look for pieces with the ids specified and return them
If a creator is specified we look for pieces by that creator and return them
 */
router.get('/api/pieces', function (req, res) {
    let ids = req.query.id;
    if(ids) {
        ids = ids.split(',');
    }
    let creator =  req.query.creator;
    if(!ids && !creator){
        res.statusCode = 400;
        res.send("No ids or creator specified!");
        return;
    }
    if(ids && creator){
        res.statusCode = 400;
        res.send("Both ids and creator specified!");
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
            res.send("creator not found!")
            return;
        }
        res.send(returnPieces);
    }
    if(ids){
        config.pieces.forEach(function (piece) {
            for(var i=0;i < ids.length;i++) {
                if (piece.id == ids[i]) {
                    returnPieces.push(piece);
                    return;
                }
            }
        });
        if(returnPieces.length === 0){
            res.statusCode = 404;
            res.send("id/s not found!")
        }
        res.send(returnPieces);
    }
});
module.exports = router;
