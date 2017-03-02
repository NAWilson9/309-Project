
//Link dependencies
let config = require('./board_connector_config.json');
const router = require('express').Router();
const fs = require('fs');
const path = require('path');


//Routing

/*
Post request to api/boards
Takes an int id from query body
id of board to update
Updates board information specified if id is found
Creates new board id with info if id not found
*/
router.post('/api/boards', function (req, res){
	let id = req.body.id;
	
	if(!id){
		res.statusCode = 404;
		res.send("No id specified!");
		return;
	}
	
	if(Object.keys(req.body).length === 0){
		res.statusCode = 404;
		res.send("No body specified!");
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
				return;
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
				return;
			}
			
		});
	}
});
/*
Get requests to api/boards
Takes an array of int ids and creator string
If both id and creator are not specified an error is returned
If both id and creator are specified an error is returned
If ids are specified we look for boards with the ids to return
If a creator is specified the boards from the creator are returned
*/
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
});

module.exports = router;