/**
 * CHSS Board Connector - by Lyle Lovig
 * @module boardConnector
 */

//Link dependencies
let config = require('./board_connector_config.json');
const router = require('express').Router();
const fs = require('fs');
const path = require('path');


//Routing


/**
 * Helper function for post requests.
 *
 * If no ID is specified in the req body it sends an error to the client.
 * If an ID is specified it queries the server to see if a board with the given ID exists.
 * If so the board is updated, if not then a board is created and stored.
 * Then the resulting updated or new board is sent back to the client.
 * If an error is encountered then the error is sent to the client and execution stops.
 *
 * @param req - contains the information for the request
 * @param res - the object to send results to
 */
const boardPostHelper = function (req, res){
    let id = req.body.id;
    if(Object.keys(req.body).length === 0){
        res.statusCode = 404;
        res.send("No body specified!");
        return;
    }
    if(!id){
        res.statusCode = 404;
        res.send("No id specified!");
        return;
    }

    let board = config.boards.find((board) => board.id === id);
    if(board){
        config.boards[config.boards.indexOf(board)] = req.body;
        fs.writeFile(path.join(__dirname, '/board_connector_config.json'), JSON.stringify(config, null, 4), function(err){
            if(err){
                res.statusCode = 500;
                res.send('Error while saving board data');
                console.error(new Date().toLocaleTimeString() + ' : Unable to save board data');
                console.error(err);
            }
            else{
                res.send(config.boards.find((board) => board.id === id));
            }
        });
    }
    else{
        config.boards[config.boards.length] = req.body;
        fs.writeFile(path.join(__dirname, '/board_connector_config.json'), JSON.stringify(config, null, 4), function(err){
            if(err){
                res.statusCode = 500;
                res.send('Error while saving board data');
                console.error(new Date().toLocaleTimeString() + ' : Unable to save board data');
                console.error(err);
            }
            else{
                res.send(config.boards[config.boards.length - 1]);
            }
        });
    }
};
router.post('/api/boards', boardPostHelper);


/**
 * Helper function for get requests.
 *
 * If IDs are specified in the req body it queries the server to get the information for each board with a specified ID.
 * If one is not found then an error is sent to the requesting client and execution stops.
 * Otherwise all the boards information is sent back to the client.
 * If a creator is specified it queries the server for all boards created by that user.
 * If none are found it sends an error to the client.
 * Otherwise it sends the found boards information to the client.
 *
 * @param req - contains the information for the request
 * @param res - the object to send results to
 */
const boardGetHelper = function(req, res){
    let id = req.query.id;
    if(id){
        id = id.split(',');
    }
    let creator = req.query.creator;
    if(!id && !creator){
        res.statusCode = 404;
        res.send("No id or creator specified!");
        return;
    }
    if(id && creator){
        res.statusCode = 400;
        res.send("Both id and creator specified");
        return;
    }
    let returnBoards = [];
    if(creator){
        config.boards.forEach(function (board) {
            if(board.creator==creator){
                returnBoards.push(board);
            }
        });
        if(returnBoards.length === 0){
            res.statusCode = 404;
            res.send("Creator not found!");
            return;
        }
        res.send(returnBoards);
    }
    if(id){
        config.boards.forEach(function (board){
            for(var i = 0; i < id.length; i++){
                if(board.id == id[i]){
                    returnBoards.push(board);
                    return;
                }
            }
        });
        if(returnBoards.length === 0 || returnBoards.length != id.length){
            res.statusCode = 404;
            res.send("Board id/s not found");
            return;
        }
        res.send(returnBoards);
    }
};
router.get('/api/boards', boardGetHelper);
module.exports = router;