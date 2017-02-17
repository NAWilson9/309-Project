
//Link dependencies
let config = require('./board_connector_config.json');
const router = require('express').Router();
const fs = require('fs');
const path = require('path');

//Global socket.io object
var io;

// Helper functions could go here

//Routing
router.get('/api/boardConnector', function (req, res) {
    res.send(config.some_key);
    io.emit(config.some_key)
});

router.post('api/boards', function (req, res){
	let id = req.query.id;
	let name = req.body.name;
	let creator = req.body.creator;
	if(!id){
		res.statusCode = 404;
		res.send("No id or creator specified!");
		return;
	}
	
	let user = config.boards.find((board) => board.id === id);
	if(user){
		user.name = name;
		user.creator = creator;
		fs.writepath(path.join(__dirname, 'board_connector_config.json'), JSON.stringify(config, null, 4), function(err){
			if(err){
				res.statusCode = 500;
				res.send('Error while saving board data');
				console.error(new Date().toLocaleTimeString() + ' : Unable to save board data');
				console.error(err);
			}
			else{
				res.send(config);
			}
		});
	}
	else{
		config.boards[config.boards.length] = req.body;
		fs.writepath(path.join(__dirname, 'board_connector_config.json'), JSON.stringify(config, null, 4), function(err){
			if(err){
				res.statusCode = 500;
				res.send('Error while saving board data');
				console.error(new Date().toLocaleTimeString() + ' : Unable to save board data');
				console.error(err);
			}	
			else{
				res.send(config);
			}
			
		});
	}
});

router.get('/api/boards', function(req, res){
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
	let returnBoards = [];
	if(!id){
		config.boards.forEach(function (board){
			for(var i = 0; i < id.length; i++){
				if(piece.id == id[i]){
					returnBoards.push(board);
				}
			}
		});
		if(returnBoards == []){
			res.statusCode = 404;
			res.send("No board id/s found");
		}
		res.send(returnBoards);
	}			
});

module.exports = function (ioObj) {
    io = ioObj;
    return router;
};